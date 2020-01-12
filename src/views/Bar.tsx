import * as React from "react";
import axios from "axios";
import md5 from 'js-md5';
import SliceFlieUpload from './slice-file-upload'
import ajax from './slice-file-upload/ajax'
class Bar extends React.Component {
  files: any[];
  constructor(props) {
    super(props);
    this.files = [];
  }
  onChange = (e) => {
    this.files = e.target.files;

    var reader = new FileReader();
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onload = function (event) {
      let obj: any = (event.target as any).result;
      console.log(md5(obj), "lll")
    }

  }
  onClick2 = () => {
    ajax({
      url: '/api/upload',
      data: {
        file: this.files[0],
        name: 'dsdfsd'
      },
    }).then((res) => {
      console.log(res)
    })
  }
  onClick = () => {
    // ajax({
    //   url:'/api/upload',
    //   data:{
    //     file : this.files[0],
    //     name:'dsdfsd'
    //   },
    // }).then((res)=>{
    //   console.log(res)
    // })
    // return ;
    // let form = new FormData();
    // if (!this.files || !this.files.length) return;
    // form.append('file', this.files[0])
    // form.append('name', 'this.files[0]')
    // // console.log(form)
    // let config = {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // };
    // axios.post('/api/upload', form, config)
    //   .then(res => {
    //     console.log(res)
    //   })
    // console.log(this.files[0],"kkkkkk")
    // return ;
    let data = new SliceFlieUpload({
      file:this.files[0],
      url:'/api/upload'
    })
  }
  render() {
    return (
      <div>

        <input onChange={this.onChange} type="file" name="logo" />
        <div onClick={this.onClick}>提交</div>
        {/* <div onClick={this.onClick2}>提交2</div> */}

      </div>
    );
  }
}

export default Bar;
