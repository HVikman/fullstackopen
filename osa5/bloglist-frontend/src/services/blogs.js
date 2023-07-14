import axios from 'axios'
const baseUrl = '/api/blogs/'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const res = await axios.get(baseUrl)
  return res.data
}

const create = async (blog) => {
  const config = { headers: { Authorization: token } }
  const res = await axios.post(baseUrl, blog, config)
  return res.data
}
const edit = async ({ blog }) => {
  const config = { headers: { Authorization: token } }

  const res = await axios.put(baseUrl+blog.id, blog, config)
  console.log(res)
  return res.data
}

const remove = async (id) => {
  const config = { headers: { Authorization: token } }
  const res = await axios.delete(baseUrl+id,config)
  console.log(res)
  return res.data
}


export default { getAll, setToken, create, edit, remove }