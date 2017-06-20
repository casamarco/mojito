import $ from "jquery";
import _ from "lodash";
import PropTypes from 'prop-types';
import React from "react";
import {FormattedMessage, injectIntl} from 'react-intl';
import {Label, Button} from "react-bootstrap";


class Paginator extends React.Component {

    /**
     * @return {JSX}
     */
    render() {

//        console.log("Paginator::render");

        const divStyle = {
            float: "right"
        };

        return (this.props.shown &&
                <div style={divStyle}>
                    <Button bsSize="small" disabled={this.props.disabled || this.props.currentPageNumber === 1}
                            onClick={this.props.onPreviousPageClicked}><span
                            className="glyphicon glyphicon-chevron-left"></span></Button>
                    <label className="mls mrs default-label current-pageNumber">
                        {this.props.currentPageNumber}
                    </label>
                    <Button bsSize="small" disabled={this.props.disabled || !this.props.hasNextPage}
                            onClick={this.props.onNextPageClicked}><span
                            className="glyphicon glyphicon-chevron-right"></span></Button>
                </div>
                );
    }

}

Paginator.propTypes = {
    "currentPageNumber": PropTypes.number.isRequired,
    "hasNextPage": PropTypes.bool.isRequired,
    "onPreviousPageClicked": PropTypes.func.isRequired,
    "onNextPageClicked": PropTypes.func.isRequired,
    "disabled": PropTypes.bool.isRequired,
    "shown": PropTypes.bool.isRequired,
}

export default injectIntl(Paginator);
