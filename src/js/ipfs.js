
//<script src="https://unpkg.com/ipfs-http-client/dist/index.min.js"></script>
//const ipfs = window.IpfsHttpClient('https://ipfs.infura.io', '5001', {protocol: 'https' });
//const ipfsClient = require('ipfs-http-client');
//const ipfs = ipfsClient('https://ipfs.infura.io:5001');


const ipfs = window.IpfsHttpClient('https://ipfs.infura.io:5001');
const Buffer = window.IpfsHttpClient.Buffer;

AppIpfs = {
    ipfsHash: null,
    buffer: "",
    

    init: function(){
        console.log("IPFS INIT");

    },

    captureFile: function(event){
        event.stopPropagation();
        event.preventDefault();
        const file = event.target.files[0];
        console.log(file);
        let reader = new FileReader();
        reader.onload = () => $('#ipfsimage').attr('src', reader.result);
        reader.readAsDataURL(file);
        $('#ipfsimage').attr('src', reader.result);
         console.log(reader.result);
        //reader.readAsArrayBuffer(file);
        reader.onloadend = () => this.convertToBuffer(reader);
    },

    convertToBuffer: async function(reader) {
        const buffer = await Buffer.from(reader.result);
        console.log(buffer);
        this.buffer = buffer; 
        return this.getHash();
    },

    getHash: async function() { 
        //const ipfsHashResult = await ipfs.add(this.buffer);
        for await (const ipfsHashResult of ipfs.add(this.buffer)) {
            console.log(ipfsHashResult)
            console.log(ipfsHashResult.path)
            this.ipfsHash = ipfsHashResult.path;
          }
        $('#ipfsHash').html(this.ipfsHash);
    },

    getFile: async function(file) {
        //let file = AppIpfs.ipfsHash;
        //let ipfsImage = await ipfs.cat(file);
        const ipfsImage = [];
        for await (const chunks of ipfs.cat(file)) {
            ipfsImage.push(chunks);
            console.log(ipfsImage);
            let image = Buffer.concat(ipfsImage).toString();
            //let image = ipfsImage.toString("utf-8");
            console.log(image);
            $('#imageHash').attr('src', image);  
          }
         
    }

}

$(function() {
    $(window).load(function() {
      AppIpfs.init();
    });
  });




