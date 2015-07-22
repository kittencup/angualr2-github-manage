import {HttpService} from './http.service';
import {Http,Headers} from 'angular2/http';
import {Inject} from 'angular2/di';

export class UserService extends HttpService {

    private username:string;
    private password:string;

    constructor(@Inject(Http) http:Http) {
        super(http);
        this.configGithubHeaders();
    }

    configGithubHeaders():UserService {
        var headers = new Headers();
        headers.set('Accept', 'application/vnd.github.v3+json');
        headers.set('Content-Type', 'application/json;charset=UTF-8');
        this.requestOptions = {
            headers: headers
        }
        return this;
    }

    setAuthorization() {
        if (!this.requestOptions) {
            this.configGithubHeaders();
        }
        this.requestOptions.headers.set('Authorization', 'Basic ' + btoa(this.username + ':' + this.password));
    }

    setUsername(username:string):UserService {
        this.username = username;
        this.setAuthorization();
        return this;
    }

    setPassword(password:string):UserService {
        this.password = password;
        this.setAuthorization();
        return this;
    }

    getRepositories():Rx.Observable<any>{
        var api = 'https://api.github.com/user/repos?type=all&sort=updated';
        return this.get(api);
    }

    deleteRepository(repository:any):Rx.Observable<any>{
        var api = 'https://api.github.com/repos/' + repository.owner.login + '/' + repository.name;
        return this.delete(api);
    }

}