import {Component,View} from 'angular2/annotations';
import {NgFor,NgIf} from 'angular2/directives';
import {httpInjectables, Http} from 'angular2/http';
import {Inject} from 'angular2/di';
import {NgIf} from 'angular2/directives';
import {GithubService} from '../services/github.service';
import {RepositoryFilter} from './repositoryFilter';
import {RepositoryGrid} from './repositoryGrid';
import {GithubForm} from './githubForm';
import {GithubError} from './githubError';
import {loading} from './loading';

@Component({
    selector: 'repository-list',
    viewInjector: [GithubService]
})
@View({
    templateUrl: './components/repositoryList.html?v=<%= VERSION %>',
    directives: [loading,RepositoryFilter, RepositoryGrid, GithubForm,GithubError,NgIf]
})
export class RepositoryList {

    private origRepositories:Array;
    private filterValue:String;
    private githubService:GithubService;
    private message:string;
    private isLoading:boolean;

    constructor(githubService:GithubService) {
        this.githubService = githubService;
    }

    onFilter(value:string):void {
        this.filterValue = value;
    }

    onDelete(repository:any):void {
        if (confirm('Delete `' + repository.name + '` Repository?')) {
          this.githubService
              .deleteRepository(repository)
              .subscribe(res => {
                  if(res === true){
                      let index = this.origRepositories.findIndex(function(o){
                          return o.id == repository.id
                      });

                      if(index !== -1){
                          this.origRepositories.splice(index, 1);
                      }
                  }else{
                      this.message = res.message;
                  }
            });
        }
    }

    onLoad(useService:GithubService) {
        this.origRepositories = [];
        this.message = null;
        this.isLoading = true;
        this.getOrigRepositories();
    }

    getOrigRepositories():void {
        var observable = this.githubService.getRepositories();

        observable.subscribe(repositories => {
            if(Array.isArray(repositories)) {
                if(!repositories.length){
                    this.message = 'repositories not found!'
                }
                this.origRepositories = repositories;
            }else{
               this.message = repositories.message;
            }

            this.isLoading = false;
        });
    }

    get repositories():Array {
        if (this.origRepositories) {
            if (this.filterValue) {
                return this.origRepositories.filter((repository:any):boolean=> {
                    return repository.name.match(this.filterValue) || repository.owner.login.match(this.filterValue)
                });
            } else {
                return this.origRepositories;
            }

        }
        return [];
    }

}