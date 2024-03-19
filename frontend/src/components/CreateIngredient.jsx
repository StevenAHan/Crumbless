import { useState } from 'react';
import '../css/createIngredient.css';

async function sendIngredientCreationRequest(data) {
    const formData = new URLSearchParams();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    return await fetch('/api/create/ingredient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    }).then(response => response.json());
}



const CreateIngredient = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  // const [image, setImage] = useState({});
  const [qType, setQType] = useState('');
  const [cBU, setCBU] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendIngredientCreationRequest({name, description, qType, cBU}).then(data => {
        if(data.message == "Ingredient created successfully") {
            alert("Ingredient created successfully");
        } else {
            alert("Ingredient creation failed");
        }
    });
  };

  function checkVal() {
    console.log(name);
    console.log(description);
    console.log(qType);
    console.log(cBU);
  }

  return (
    <div className='create-ingredient-container'>
      <h1>Create Ingredient</h1>
      <form onSubmit={handleSubmit}  className='create-ingredient-form'>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        {/* <br />
        <label>
          Image:
          <input
            type="file"
            onChange={(e) => setImage(e.target.value)}
          />
        </label> */}
        <br />
        <label>
          Quantity Type:
          <input
            type="text"
            value={qType}
            onChange={(e) => setQType(e.target.value)}
          />
        </label>
        <br />
        <label>
          Created By User:
          <input
            type="checkbox"
            value={cBU}
            onChange={(e) => setCBU(e.target.value)}  
          />
        </label>    
        <br />
        <button type="submit" onClick={(e) => handleSubmit(e)}>Submit</button>

        <br />
        <button onClick={() => checkVal()}>checkVals</button>
      </form>
    </div>
  );
};

export default CreateIngredient;
