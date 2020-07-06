import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/Rx';
import * as _ from 'lodash';
import * as moment from 'moment'

@Injectable()
export class AppService {
    constructor(private http: Http) {
    }

    getMovies() {

        return this.http.get('http://localhost:5000/movies')
            .toPromise()
            .then((response) => {
                const movies = response.json();
                const tableContent = [];
                let i = 1;
                for (let movie of movies) {
                    const obj = {};
                    obj['position'] = i++;
                    obj['title'] = movie.title;
                    obj['year'] = movie.year;
                    obj['released'] = moment(movie.released).format('DD-MM-YYYY');
                    obj['runtime'] = movie.runtime;
                    obj['genre'] = movie.genre;
                    obj['director'] = movie.director;
                    tableContent.push(obj);
                }
                return tableContent;
            });
    }

    getAutoComplete(title) {
        return this.http.get('http://10.105.16.200:5000/auto?q=' + title)
            .toPromise()
            .then((response) => {
                console.log(response);
                return response.json();
            });
    }

    getRecomData(str) {

        return this.http.get('http://localhost:3000/recom?q=' + str)
            .toPromise()
            .then((response) => {
                return response.json();
            });

    }

    getSimilarProducts(product) {
        console.log(product);
        return this.http.get(`http://localhost:3000/similar?color=${product.color}&category=${product.category[0]}&brand=${product.brand[0]}`)
            .toPromise()
            .then((response) => {
                return response.json();
            });
    }

    getMovieDetails(id) {
        return this.http.get('http://localhost:5000/movie/' + id)
            .toPromise()
            .then((response) => {
                console.log(response.json());
                return response.json();
            });
    }

    getReview(id) {
        return this.http.get('http://localhost:5000/review/' + id)
            .toPromise()
            .then((response) => {
                console.log(response.json());
                const resp = response.json();
                const returnObj = {
                    critic: [],
                    public: []
                }

                _.each(_.keys(resp.critic), key => {
                    returnObj.critic.push(resp.critic[key]);
                    returnObj.public.push(resp.public[key]);
                })

                console.log(returnObj);
                return returnObj;
            });
    }
}
