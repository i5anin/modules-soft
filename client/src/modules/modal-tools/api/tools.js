import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
})

const handleResponse = (response) => {
  return response.data
}

const handleError = (error) => {
  throw error
}

export const fetchInstrumentData = (no, nomId) => {
  return api
    .get('instr_op_info', {
      params: { no: no, nom_id: nomId },
    })
    .then(handleResponse)
    .catch(handleError)
}
