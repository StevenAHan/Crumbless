import { useState } from 'react';

async function sendIngredientCreationRequest(data) {
    const formData = new URLSearchParams();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    return await fetch('/api/create/ingredient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    }).then(data => data.json());
}



const CreateIngredient = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [qType, setQType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    sendIngredientCreationRequest({name, description}).then(data => {
        if(data.message == "Ingredient created successfully") {
            alert("Ingredient created successfully");
        } else {
            alert("Ingredient creation failed");
        }
    });
  };

  return (
    <div>
      <h1>Create Ingredient</h1>
      <form onSubmit={handleSubmit}>
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
        <br />
        <label>
          Image:
          <input
            type="file"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </label>
        <br />
        <label>
          Quantity Type:
          <input
            type="text"
            value={qType}
            onChange={(e) => setQType(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateIngredient;
