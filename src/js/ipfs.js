

//const ipfs = window.IpfsHttpClient('https://ipfs.infura.io', '5001', {protocol: 'https' });
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

    convertToBuffer: async function(reader){
        const buffer = await Buffer.from(reader.result);
        console.log(buffer);
        this.buffer = buffer; 
        return this.getHash();
    },

    getHash: async function(){
        let ipfsHashResult = await ipfs.add(this.buffer);
        console.log(ipfsHashResult);
        this.ipfsHash = ipfsHashResult[0].hash;
        console.log(this.ipfsHash);
        $('#ipfsHash').html(this.ipfsHash);
    },

    getFile: async function(file) {
        //let file = AppIpfs.ipfsHash;
        let ipfsImage = await ipfs.cat(file);
        console.log(ipfsImage);
        let image = ipfsImage.toString("utf8");
        console.log(image);
        $('#imageHash').attr('src', image);  
    }

}

$(function() {
    $(window).load(function() {
      AppIpfs.init();
    });
  });




