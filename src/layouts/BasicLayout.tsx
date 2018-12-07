import React from "react";
import Footer from "../components/Footer/Index";

export default class Index extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  public render() {
    const {location} =this.props;

    return (
      <div>1
        <Footer location={location}/>
      </div>
    );
  }
}

