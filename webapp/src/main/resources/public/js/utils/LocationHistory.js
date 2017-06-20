import $ from "jquery";

class LocationHistory {

    /**
     * Updates the browser location for a given pathname and query params
     *
     * If the URL is only the pathname replace the history state 
     * (to reflect the params) else if the query has changed
     * push a new state to keep track of the change param modification.
     *
     * @param {stinrg} pathname the pathname of the url to be processed
     * @param {object} params params to build the query string
     */
    updateLocation(router, pathname, params) {

        console.log("LoactionHistory::updateLocation");
        if (window.location.pathname === pathname) {

            let newQuery = this.buildQuery(params);

            if (window.location.search === "") {
                router.replace(pathname + "?" + newQuery, null, null);
            } else if (!this.isCurrentQueryEqual("?" + newQuery)) {
                router.push(pathname + "?" + newQuery, null, null);
            }
        }
    }

    /**
     * @param {string} queryString Starts with ?
     * @return boolean
     */
    isCurrentQueryEqual(queryString) {
        return queryString === window.location.search;
    }

    /**
     * Create query string given params
     *
     * @param params
     * @return {*}
     */
    buildQuery(params) {
        let cloneParam = _.clone(params);
        delete cloneParam["changedParam"];
        return $.param(cloneParam);
    }
};

export default new LocationHistory();



