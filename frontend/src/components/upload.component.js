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
        if (this.state.name !== "") {
            name = this.state.name;
        } else {
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
        .then(response => console.log(response))
        .catch(error => console.log(`Error: ${error}`));
    }



    render() {
        return <form onSubmit={this.handleSubmit}>
            <label>Upload image:
                <input type="file" ref={this.fileInput}></input>
            </label>
            <label>Image name:
                <input type="text" value={this.state.name} onChange={this.handleNameChange}></input>
            </label>
            <input type="submit" value="Submit"></input>            
        </form>
    }
}