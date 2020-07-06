from flask import Flask, request, session

from flask_cors import CORS
from src.spell_correction import preprocess, preprocess_cool
from src.glove import model, top_query
import json
import numpy as np
import scipy

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


def get_score(row):
    try:
        vector_1 = np.mean([model[word] for word in row.in_query.split(" ")], axis=0)
        vector_2 = np.mean([model[word] for word in row.query.split(" ")], axis=0)
        score = scipy.spatial.distance.cosine(vector_1, vector_2)
        return score
    except Exception as e:
        # print('one={0}'.format(e))
        pass


# setup_app(app)

@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/prep')
def perp():
    query = request.args.get('q')
    return json.dumps(preprocess(query))


@app.route('/recom')
def recom():
    query = request.args.get("q")
    preprocess(query)
    #  get from solr
    #  convert it to format ui wants
    return json.dumps({"res": [{"p": "product 1", "b": "brand 1", "a": ["attr1", "attr2"]}], "query": query})


@app.route('/sim')
def sim_prod():
    prod = request.args.get("p")
    return json.dumps([{"name": "blue back shirt", "brand": "holla chola", "cat": "Apperal|Clothing|shirt|men"},
                       {"name": "blue back dress", "brand": "holly molly", "cat": "Apperal|Clothing|dress|women"}])


@app.route('/auto')
def auto_com():
    try:
        query = request.args.get("q")
        top_query['in_query'] = ' '.join(preprocess_cool(query))
        top_query['score'] = top_query.apply(get_score, axis=1)
        res = top_query.sort_values('score').head(5)['query'].to_json()
        return res
    except Exception as e:
        # print('two = {0}'.format(e))
        return {"res": "nah ho payi"}
        pass


if __name__ == '__main__':
    app.run()
