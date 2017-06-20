import $ from "jquery";
import _ from "lodash";
import PropTypes from 'prop-types';
import React from "react";
import {FormattedMessage, injectIntl} from 'react-intl';
import {Label} from "react-bootstrap";


let ScreenshotsTextUnit = React.createClass({

    propTypes: {
        "textUnit": PropTypes.object.isRequired,
        "onNameClick": PropTypes.func.isRequired,
        "onTargetClick": PropTypes.func.isRequired,
    },

    /**
     * @return {JSX}
     */
    render() {

//        console.log("ScreenshotsTextUnit::render");

        const textUnitStyle = {
            marginBottom: "5px",
            paddingLeft: "5px",
            paddingBottom: "5px",
            borderBottom: "solid 1px #CCC", //color-gray-light
        };

        const nameStyle = {
            marginBottom: "5px",
        };

        const sourceStyle = {
//            color: "#CCC", //.color-gray-light2
        };

        const targetStyle = {

        };

        return (
                <div style={textUnitStyle}>
                    <div className='mbxs'>
                        <Label bsStyle='primary' bsSize='large' className="mrxs mtl clickable" onClick={this.props.onNameClick}>
                            {this.props.textUnit.name}
                        </Label> 
                    </div>
                    <div className='em color-gray-light2' style={sourceStyle}>{this.props.textUnit.source}</div>
                    <div className="clickable" style={targetStyle} onClick={this.props.onTargetClick}>{this.props.textUnit.target}</div> 
                </div>
                );
    }

});

export default injectIntl(ScreenshotsTextUnit);
