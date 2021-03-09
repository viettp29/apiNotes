const express = require('express')
const router = express.Router()

// Load model
const Note = require('../models/note')

// Hien thi tat ca cac bai viet
router.get('/', async (req, res) => {
  const notes = await Note.find().lean().sort({ date: -1 })
  res.render('notes/index', { notes })
})

// Hien thi form de tao bai viet moi
router.get('/add', (req, res) => {
  res.render('notes/add')
})

// Tao post moi
router.post('/', async (req, res) => {
  const { title, text } = req.body

  let errors = []

  if (!title) errors.push({ msg: 'Title required' })
  if (!text) errors.push({ msg: 'Text required' })
  if (errors.length > 0) res.render('notes', { title, text })
  else {
    const newNoteData = { title, text }
    const newNote = new Note(newNoteData)
    await newNote.save()
    res.redirect('/notes')
  }
})

// Hien thi form de nguoi dung thay doi bai viet
router.get('/edit/:id', async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id }).lean()
  res.render('notes/edit', { note })
})

// Cap nhap thay doi bai viet vao co so du lieu
router.put('/:id', async (req, res) => {
  const { title, text } = req.body
  await Note.findOneAndUpdate({ _id: req.params.id }, { title, text })
  res.redirect('/notes')
})

// Xoa bai viet
router.delete('/:id', async (req, res) => {
  await Note.findOneAndRemove({ _id: req.params.id })
  res.redirect('/notes')
})

module.exports = router
