import React from "react";

export default class Upload extends React.Component {

    constructor(props) {
        super(props)        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileInput = React.createRef();
    }

    handleSubmit(event) {
        event.preventDefault();
        const name = this.fileInput.current.files[0].name.split(".").slice(0, -1).join(".");
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
            <input type="submit" value="Submit"></input>            
        </form>
    }
}