from flask import Flask, jsonify
 
app = Flask(__name__)
 
cities = "hihihi"

@app.get('/data')
def get_data() -> str:
    """
    Endpoint to return clique data.
    """
    
    return jsonify({
        'Cities': cities
    })


if __name__ == '__main__':
    app.run(debug=True)