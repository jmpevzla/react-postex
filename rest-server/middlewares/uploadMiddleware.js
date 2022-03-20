const Axios = require('axios').default
const fs = require('fs')
const multer  = require('multer')
const { createUrlPosts } = require('./utils')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    let ext = ''
    switch(file.mimetype) {
      case 'image/jpeg':
        ext = '.jpg'
        break
      case 'image/png':
        ext = '.png'
        break
      case 'image/gif':
        ext = '.gif'
        break
      case 'image/svg+xml':
        ext = '.svg'
        break
    }
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  }
})
const upload = multer({ storage })

const axios = Axios.create({
  headers: {
      'no-auth': 1
  }
})

module.exports = [upload.single('photo'), async (req, res, next) => {
  if (req.path.includes('/posts/upload') && req.method === 'POST') {
    const split = req.path.split('/')
    const id = Number(split.pop())
    if (isNaN(id) || id < 1) {
      return next()
    }
    const photo = (req.file?.path || '').replace('public/', '')
    
    if (photo) {
      try {
        const url = createUrlPosts(req)
        const axres = await axios.get(`${url}/${id}`)
        const post = axres.data 
        await axios.patch(`${url}/${id}`, {
          ...post,
          photo
        })
        return res.json({ id, photo, ok: true, error: '' })
      } catch(err) {
        console.error(err)
        fs.unlinkSync(req.file.path)
        return res.json({ id, photo: null, ok: false, error: err.message })
      }
    } 

    return res.json({ id, photo: null, ok: false, error: 'The file can not be processed, please verify the file and try again.' })
  }
  next()
}]