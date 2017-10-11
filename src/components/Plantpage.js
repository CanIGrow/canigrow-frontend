import React, { Component } from 'react';
import request from 'superagent';
import '../styles/App.css';

export default class Plantpage extends Component {
  constructor(props) {
      super(props)
      this.state = {
        plant_id: 1,
        common_name: null,
        main_image: null,
        wikipedia_image: null,
        wikipedia_image_final: null,
        wikipedia_responseText: null,
        plantdata: false,
        image_message: null,
      };
  }

  // This gets and md5 hash for a given string.
  // Source: https://css-tricks.com/snippets/javascript/javascript-md5/
  md5(string) {

     function RotateLeft(lValue, iShiftBits) {
             return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
     }

     function AddUnsigned(lX,lY) {
             var lX4,lY4,lX8,lY8,lResult;
             lX8 = (lX & 0x80000000);
             lY8 = (lY & 0x80000000);
             lX4 = (lX & 0x40000000);
             lY4 = (lY & 0x40000000);
             lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
             if (lX4 & lY4) {
                     return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
             }
             if (lX4 | lY4) {
                     if (lResult & 0x40000000) {
                             return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                     } else {
                             return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                     }
             } else {
                     return (lResult ^ lX8 ^ lY8);
             }
     }

     function F(x,y,z) { return (x & y) | ((~x) & z); }
     function G(x,y,z) { return (x & z) | (y & (~z)); }
     function H(x,y,z) { return (x ^ y ^ z); }
     function I(x,y,z) { return (y ^ (x | (~z))); }

     function FF(a,b,c,d,x,s,ac) {
             a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
             return AddUnsigned(RotateLeft(a, s), b);
     };

     function GG(a,b,c,d,x,s,ac) {
             a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
             return AddUnsigned(RotateLeft(a, s), b);
     };

     function HH(a,b,c,d,x,s,ac) {
             a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
             return AddUnsigned(RotateLeft(a, s), b);
     };

     function II(a,b,c,d,x,s,ac) {
             a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
             return AddUnsigned(RotateLeft(a, s), b);
     };

     function ConvertToWordArray(string) {
             var lWordCount;
             var lMessageLength = string.length;
             var lNumberOfWords_temp1=lMessageLength + 8;
             var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
             var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
             var lWordArray=Array(lNumberOfWords-1);
             var lBytePosition = 0;
             var lByteCount = 0;
             while ( lByteCount < lMessageLength ) {
                     lWordCount = (lByteCount-(lByteCount % 4))/4;
                     lBytePosition = (lByteCount % 4)*8;
                     lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                     lByteCount++;
             }
             lWordCount = (lByteCount-(lByteCount % 4))/4;
             lBytePosition = (lByteCount % 4)*8;
             lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
             lWordArray[lNumberOfWords-2] = lMessageLength<<3;
             lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
             return lWordArray;
     };

     function WordToHex(lValue) {
             var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
             for (lCount = 0;lCount<=3;lCount++) {
                     lByte = (lValue>>>(lCount*8)) & 255;
                     WordToHexValue_temp = "0" + lByte.toString(16);
                     WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
             }
             return WordToHexValue;
     };
     function Utf8Encode(string) {
             string = string.replace(/\r\n/g,"\n");
             var utftext = "";
             for (var n = 0; n < string.length; n++) {
                     var c = string.charCodeAt(n);

                     if (c < 128) {
                             utftext += String.fromCharCode(c);
                     }
                     else if((c > 127) && (c < 2048)) {
                             utftext += String.fromCharCode((c >> 6) | 192);
                             utftext += String.fromCharCode((c & 63) | 128);
                     }
                     else {
                             utftext += String.fromCharCode((c >> 12) | 224);
                             utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                             utftext += String.fromCharCode((c & 63) | 128);
                     }
             }
             return utftext;
     };
     var x=Array();
     var k,AA,BB,CC,DD,a,b,c,d;
     var S11=7, S12=12, S13=17, S14=22;
     var S21=5, S22=9 , S23=14, S24=20;
     var S31=4, S32=11, S33=16, S34=23;
     var S41=6, S42=10, S43=15, S44=21;
     string = Utf8Encode(string);
     x = ConvertToWordArray(string);
     a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
     for (k=0;k<x.length;k+=16) {
             AA=a; BB=b; CC=c; DD=d;
             a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
             d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
             c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
             b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
             a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
             d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
             c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
             b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
             a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
             d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
             c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
             b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
             a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
             d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
             c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
             b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
             a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
             d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
             c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
             b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
             a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
             d=GG(d,a,b,c,x[k+10],S22,0x2441453);
             c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
             b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
             a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
             d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
             c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
             b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
             a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
             d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
             c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
             b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
             a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
             d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
             c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
             b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
             a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
             d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
             c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
             b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
             a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
             d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
             c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
             b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
             a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
             d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
             c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
             b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
             a=II(a,b,c,d,x[k+0], S41,0xF4292244);
             d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
             c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
             b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
             a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
             d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
             c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
             b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
             a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
             d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
             c=II(c,d,a,b,x[k+6], S43,0xA3014314);
             b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
             a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
             d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
             c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
             b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
             a=AddUnsigned(a,AA);
             b=AddUnsigned(b,BB);
             c=AddUnsigned(c,CC);
             d=AddUnsigned(d,DD);
     		}

     	var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
     	return temp.toLowerCase();
  }


  plantInfoGet(event) {
    //  This lets the user 'bypass' CORs via proxy.
     const proxyurl = "https://boiling-castle-73930.herokuapp.com/";
     if( event !== undefined){
       event.preventDefault();
     }
     let search_term = 'Potentilla';
     let returned_value = false;
    //  Keep this while testing.
     returned_value = true;
     request
      .get(`${proxyurl}https://canigrow.herokuapp.com/api/plants/${this.state.plant_id}`)
      .end((err, res)=>{
        if (res !== undefined){
          console.log(res.body);
          if (res.body !== undefined && res.body !== null){
            if (res.body.plant !== undefined && res.body.plant !== null){
              // console.log(res.body.plant.common_name);
              // console.log(res.body.plant.scientific_name);

              search_term = res.body.plant.scientific_name;
              this.setState({common_name: res.body.plant.common_name});
              this.setState({plantdata: res.body.plant});
              returned_value = true;
            }
          }

          // This obtains an image from wikipedia
          if(returned_value){
            console.log("Search Term: " + search_term);

            let only_first_search_term = search_term.substr(0,search_term.indexOf(' '));
            console.log(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages%7Cpageterms&generator=prefixsearch&redirects=1&formatversion=2&piprop=thumbnail&pithumbsize=250&pilimit=20&wbptterms=description&gpssearch=`+`${search_term}`+`&gpslimit=20`);
             request
             .get(`${proxyurl}https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages%7Cpageterms&generator=prefixsearch&redirects=1&formatversion=2&piprop=thumbnail&pithumbsize=250&pilimit=20&wbptterms=description&gpssearch=`+`${search_term}`+`&gpslimit=20`)
              .end((err, res)=>{
                // console.log(res);
                // console.log(res.xhr.responseText);
                let string = res.xhr.responseText
                let obj = JSON.parse(string);
                // console.log(obj);
                // console.log(obj.query);
                if(obj.query !== undefined){
                  let imageNum = Object.keys(obj.query.pages)[0];
                  // console.log(obj.query.pages);
                  // console.log(obj.query.pages[0]);
                  if( obj.query.pages[0].thumbnail === undefined){
                    console.log('No Image to Show');
                    this.setState({image_message : "There are no images currently available for this plant."});
                    this.setState({wikipedia_image_final: 'https://target.scene7.com/is/image/Target/52113936_Alt01?wid=520&hei=520&fmt=pjpeg'});
                  } else {
                    this.setState({image_message : "null"});
                    console.log(obj.query.pages[0].thumbnail.source);
                    this.setState({wikipedia_image_final: obj.query.pages[0].thumbnail.source});
                    // If the search was for Hosta.
                    if(search_term === 'Hosta'){
                      this.setState({wikipedia_image_final: 'https://www.whiteflowerfarm.com/mas_assets/cache/image/3/6/6/f/13935.Jpg'});
                    }
                  }
                } else {
                  // This is a  different request that returns different json. It is an alternative way to obtain an image using only one search term.
                  console.log("Try to get images another way");
                  // console.log(res);
                  let only_first_search_term = search_term.substr(0,search_term.indexOf(' '));
                  console.log(only_first_search_term);
                  request
                  .get(`${proxyurl}https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages%7Cpageterms&generator=prefixsearch&redirects=1&formatversion=2&piprop=thumbnail&pithumbsize=250&pilimit=20&wbptterms=description&gpssearch=`+`${only_first_search_term}`)
                   .end((err, res)=>{
                      //  console.log(res);
                      //  console.log(res.xhr.responseText);
                      let string = res.xhr.responseText
                      let obj = JSON.parse(string);
                      //  console.log(obj);
                      //  console.log(obj.query.pages[0]);
                      let imageNum = Object.keys(obj.query.pages)[0];
                      // console.log(obj.query.pages[0].thumbnail.source);

                      // If the search was for Hosta Hosta ventricosa.
                      if(search_term === 'Hosta ventricosa' || search_term === 'Hosta plantaginea'){
                        this.setState({wikipedia_image_final: 'https://www.whiteflowerfarm.com/mas_assets/cache/image/3/6/6/f/13935.Jpg'});
                      } else {
                        if(obj.query.pages[0].thumbnail !== undefined){
                          this.setState({wikipedia_image_final: obj.query.pages[0].thumbnail.source});
                        } else {
                          this.setState({wikipedia_image_final: 'https://target.scene7.com/is/image/Target/52113936_Alt01?wid=520&hei=520&fmt=pjpeg'});
                        }
                      }
                      this.setState({image_message : "null"});
                   })

                }

              })

          }

          // request
          // .get(`${proxyurl}https://en.wikipedia.org/w/api.php?action=query&titles=`+`${search_term}`+`&prop=images&format=json&imlimit=5`)
          //  .end((err, res)=>{
          //    console.log('');
          //    console.log('Carrot');
          //    console.log(res.xhr.responseText);
          //    let string = res.xhr.responseText
          //    let obj = JSON.parse(string);
          //    console.log(obj.query.pages[0]);
          //    console.log(obj.query.pages[5985739]);
          //    console.log(obj.query.pages[5985739].images[0].title);
          //    let front = "https://upload.wikimedia.org/wikipedia/commons/b/bd/";
          //    let premiddle = obj.query.pages[5985739].images[0].title;
          //    let middle = premiddle.substring(5);
          //    console.log(middle);
          //    let total = front+middle;
          //    console.log(total);
          //   this.setState({wikipedia_responseText: res.xhr.responseText});
          //  })

          // request
          // .get(`${proxyurl}https://en.wikipedia.org/w/api.php?action=query&titles=`+`${search_term}`+`&prop=images&format=json&imlimit=5`)
          //  .end((err, res)=>{
          //   console.log(err);
          //   console.log(res.xhr);
          //   console.log(res.xhr.responseText);
          //   let string = res.xhr.responseText
          //   let obj = JSON.parse(string);
          //   let imageNum = Object.keys(obj.query.pages)[0];
          //   let numString = JSON.stringify(obj.query.pages);
          //   if (obj.query.pages[imageNum].images !== undefined) {
          //     console.log(obj.query.pages[imageNum].images[0].title);
          //     this.setState({wikipedia_image: obj.query.pages[imageNum].images[0].title});
          //     let front_no_hash = "https://upload.wikimedia.org/wikipedia/commons/";
          //     let premiddle = obj.query.pages[imageNum].images[0].title;
          //     let middle = premiddle.substring(5);
          //     let hash = this.md5(middle);
          //     let hashA = hash.substring(0, 1);
          //     let hashB = hash.substring(0, 2);
          //     let front = front_no_hash + hashA + '/' + hashB + '/'
          //     let total = front+middle;
          //     console.log(total);
          //     this.setState({wikipedia_image_final: total});
          //   }
          //  })

        }
      })
  }

  componentWillMount() {
    console.log(this.props);
    const proxyurl = "https://boiling-castle-73930.herokuapp.com/";
    this.setState({plant_id:window.location.href.split("/plants/")[1]}, ()=>{
      request
       .get(`${proxyurl}https://canigrow.herokuapp.com/api/plants/${this.state.plant_id}`)
       .end((err, res)=>{
         if (res !== undefined && res !== null){
           if (res.body !== undefined && res.body !== null){
             if (res.body.plant !== undefined && res.body.plant !== null){
              //  console.log(res.body.plant.common_name);
               this.plantInfoGet();
               this.setState({plantdata: res.body.plant});
               console.log('Plant Data');
               console.log(res.body.plant);
             }
           }
         }
       })
    });
  }

  updateFromField(stateKey) {
      return (event) => {
        this.setState({[stateKey]: event.target.value});
      }
  }

  render() {
    console.log(this.state.image_message);
    return (
      <div className="plantpage-container main-component-container">
        <div className="plantpage-sub-container">
          {/* <div className="testing_plant_by_id_box">
            <form className="enterForm" onSubmit={this.handleFormSubmit}>
              <div className="form-group">
                <h6>Plant ID:</h6>
                <input type="text" onChange={this.updateFromField('plant_id')} value={this.state.plant_id} placeholder="plant_id"/>
              </div>
              <div className="form-group pull-right">
                <button className="btn btn-primary btn-lg" type="submit" onClick={event => this.plantInfoGet(event)}>Get Plant Information</button>
              </div>
            </form>
          </div> */}



          <div className="top_items_plant_page">
            <div className="all_plant_page_images">
              <img className="plant_big_image" src={this.state.wikipedia_image_final} alt="plant_img"/>
            </div>
            <div className="top_items_plant_page_right">
              <div className="top_items_plant_page_right_tile">{this.state.plantdata ? (
                <h2>
                  {this.state.plantdata.common_name}
                </h2>  ): ""}
              </div>
              <hr/>

              <div className="top_items_plant_page_right_plant_info">
                {this.state.plantdata ? (
                  <div>
                    <p className="plant_info_scientific_name">{this.state.plantdata.scientific_name}</p>
                    <p>Grows to: {this.state.plantdata.height} tall,</p>
                    <p>and {this.state.plantdata.spread} wide</p>
                    <p>This plant grows: {this.state.plantdata.form}</p>
                    <p>Grows best during: {this.state.plantdata.seasonal_interest}</p>
                  </div>
                   ): ""}
              </div>
            </div>
          </div>








          {/* <p>{this.state.common_name}</p> */}
          {/* <p>{this.state.wikipedia_responseText}</p>
          <p>{this.state.wikipedia_image}</p>
          <p>Above Image Link:</p>
          <p>{this.state.wikipedia_image_final}</p> */}
          {/* <img className="plant_big_image" src="https://upload.wikimedia.org/wikipedia/commons/8/8d/2005asparagus.PNG" alt="plant_img"/> */}

          {/* <img className="plant_big_image" src="" alt="plant_img"/> */}
        </div>
      </div>
    );
  }
}
