/* Utils.js */
/* This file contains functions you can use anywhere in your application */

export const getInputFilter = () =>{
    const people = [
	  "Siri",
	  "Alexa",
	  "Google",
	  "Facebook",
	  "Twitter",
	  "Linkedin",
	  "Sinkedin"
	];
  	const [searchTerm, setSearchTerm] = React.useState("");
	const [searchResults, setSearchResults] = React.useState([]);
	const [showFilterInput, setShowFilterInput] = React.useState(false);
	const handleChange = event => {
		var _value = event.target.value;
		setSearchTerm(_value);
	};
	React.useEffect(() => {
	    const results = people.filter(person => person.toLowerCase().includes(searchTerm));
	    if(results.length > 0){
	    	setShowFilterInput(true);
	    	setSearchResults(results);
	    }else{
	    	setShowFilterInput(false);
	    	setSearchResults([]);
	    }
	}, [searchTerm]);
	/*FILTER INPUT*/
	return (
		<Form.Group  controlId="formBasicTag">
            <Form.Label >1.- Tag</Form.Label>
            <Form.Control size="sm" type="text" value={searchTerm} onChange={handleChange} placeholder="Search Tag" />
            {showFilterInput &&
                <div className="contFilterList">
                	<ListGroup variant="flush">
                    	{searchResults.map(item => (
				          <ListGroup.Item action href="#link1">{item}</ListGroup.Item>
				        ))}
					</ListGroup>
                </div>
            }
            <Form.Text className="text-muted">
              This tag must be unique. Example, hello_how_are_you
            </Form.Text>
        </Form.Group>
	);
}

/*function formatName(label) {
   // your logic
}

function formatDate(date) {
   // your logic
}

// Now you have to export each function you want
export {
   formatName,
   formatDate,
   getInputFilter
};*/