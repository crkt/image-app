import React from "react";

export default class Upload extends React.Component {

    constructor(props) {
        super(props)        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileInput = React.createRef();
    }

    handleChange(event) {
        this.setState({images: event.target.vale})
    }

    handleSubmit(event) {
        let requestOptions = {
            method: "POST",
            body: this.fileInput.current.files
        }
        event.preventDefault();
        fetch("http://localhost:3002/images", requestOptions)
        .then(response => console.log(response))
        .catch(error => console.log(`Error: ${error}`));        
    }

    state = { 
        images: []
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