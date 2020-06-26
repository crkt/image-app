import React from "react";

export default class Upload extends React.Component {

    constructor(props) {
        super(props)        
        this.state = {
            name: ""
        }
        this.fileInput = React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleNameChange(event) {
        this.setState({name: event.target.value})
    }    

    handleSubmit(event) {
        event.preventDefault();        
        let name;

        if (this.fileInput.current.files.length === 0) {
            alert("You must select a file before submitting");
            return;
        }

        if (this.state.name !== "") {
            name = this.state.name;
        } else {
            // default to image name if no name is provided
            name = this.fileInput.current.files[0].name.split(".").slice(0, -1).join(".");
        }

        const image = this.fileInput.current.files[0];

        let data = new FormData();
        data.append("name", name);
        data.append("photo", image);

        const requestOptions = {
            method: "POST",
            body: data
        }

        fetch("http://localhost:3002/images", requestOptions)
        .then(response => {            
            if (response.status === 201) {                
                document.getElementById("upload-form").reset();
                this.setState({name: ""})
                alert("Successfully uploaded image!")
            } else if (response.status === 500) {
                alert("Failed to upload the image. Ensure the image is of .jpeg or .png format");
            }
        })
        .catch(error => {            
            alert("Failed to upload image due to: ", error);
        });
    }



    render() {
        return <div id="upload-component">
            <form id="upload-form" onSubmit={this.handleSubmit}>
            <div>
                <label>Upload image:</label>
                <input id="file-input" type="file" ref={this.fileInput}></input>
            </div>
            <div>
                <label>Image name:</label>
                <input id="text-input" type="text" value={this.state.name} onChange={this.handleNameChange}></input>
            </div>
            <input id="submit-button" type="submit" value="Submit"></input>
        </form>
        </div>
    }
}