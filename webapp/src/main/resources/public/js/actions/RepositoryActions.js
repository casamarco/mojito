import $ from "jquery";
import alt from "../alt";

class RepositoryActions {

    init() {
        this.getAllRepositories();
    }

    getAllRepositories() {

        //TODO this is not good it must use the SDK'

        return (dispatch) => $.get("/api/repositories").then(response => {
           dispatch(response);
        });
    }
}

export default alt.createActions(RepositoryActions);
