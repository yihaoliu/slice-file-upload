import * as React from "react";
import axios from "axios";
class Bar extends React.Component {
  files: any[];
  constructor(props) {
    super(props);
    this.files = [];
  }
  onChange = (e) => {
    this.files = e.target.files;
    // console.log(e.target.files[0],"lll")
  }
  onClick = () => {
    let form = new FormData();
    if(!this.files || !this.files.length) return ;
    form.append('file', this.files[0])
    form.append('name', 'this.files[0]')
    // console.log(form)
    let config = {
      headers:{
        'Content-Type':'multipart/form-data'
      }
    };
    axios.post('/api/upload',form,config)
      .then(res => {
       console.log(res)
      })
  }
  render() {
    return (
      <div>

        <input onChange={this.onChange} type="file" name="logo" />
        <div onClick={this.onClick}>提交</div>

      </div>
    );
  }
}

export default Bar;
