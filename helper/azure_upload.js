const azure = require('azure-storage');
const blobService = azure.createBlobService(`${process.env.AZURE_ACCOUNT}`,`${process.env.AZURE_KEY}`);

function uploadLogo(id,logo){
  var blob_name = 'images'+id
   return new Promise((resolve,reject) => {
     blobService.createBlockBlobFromFile(process.env.AZURE_CONTAINER, blob_name, logo, (error, result, response) => {
       if (error) {
         console.log(error);
         reject(error)
       } else {
         resolve( {
           status: 'succes',
           logo_url: blobService.getUrl(process.env.AZURE_CONTAINER,blob_name)
         })
       }
     })
   })
}

exports.modules = uploadLogo
