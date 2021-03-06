const Clarifai=require('clarifai');


const app = new Clarifai.App({
    apiKey: 'f8177366b43e4715814679343493853c',
  });

  const handleApiCall = (req, res) => {
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
      .then(data => {
        console.log(data)
        res.json(data);
        
      })
      .catch(err => res.status(400).json(err))
  }
  
     
const handleImage=(req, res,db) => {
    const { id } = req.body;
    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err => res.json('Unable to get entries'))
};

module.exports={
    handleImage:handleImage,
    handleApiCall:handleApiCall
};

