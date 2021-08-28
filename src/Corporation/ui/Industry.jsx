// React Component for managing the Corporation's Industry UI
// This Industry component does NOT include the city tabs at the top
import React from "react";
import { BaseReactComponent }       from "./BaseReactComponent";

import { IndustryOffice } from "./IndustryOffice";
import { IndustryOverview } from "./IndustryOverview";
import { IndustryWarehouse } from "./IndustryWarehouse";

export class Industry extends BaseReactComponent {
    constructor(props) {
        if (props.currentCity == null) {
            throw new Error(`Industry component constructed without 'city' prop`);
        }

        super(props);
    }

    render() {
        return (
            <div>
            <div className={"cmpy-mgmt-industry-left-panel"}>
                <IndustryOverview
                    routing={this.props.routing}
                    eventHandler={this.props.eventHandler}
                    corp={this.props.corp}
                    currentCity={this.props.currentCity}
                />
                <IndustryOffice {...this.props} />
            </div>

            <div className={"cmpy-mgmt-industry-right-panel"}>
                <IndustryWarehouse
                    corp={this.props.corp}
                    routing={this.props.routing}
                    currentCity={this.props.currentCity}
                    eventHandler={this.props.eventHandler}
                />
            </div>
            </div>
        )

    }
}
