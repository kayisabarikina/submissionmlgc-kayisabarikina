const predictClassification = require('../services/inferenceService');
const { v4: uuidv4 } = require('uuid');
const storeData = require('../services/storeData');
const getData = require('../services/getData');

async function postPredictHandler(request, h) {
  try {
    const { image } = request.payload;
    const { model } = request.server.app;

    const { label, suggestion } = await predictClassification(model, image);
    const id = uuidv4(); // Menggunakan uuidv4() untuk menghasilkan UUID
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: label,
      suggestion: suggestion,
      createdAt: createdAt,
    };

    await storeData(id, data);

    const response = h.response({
      status: 'success',
      message: 'Model is predicted successfully',
      data,
    }).code(201);

    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi',
    }).code(500);
    
    return response;
  }
}

async function getPredictHistories(request, h) {
  try {
    const data = await getData();

    const response = h.response({
      status: 'success',
      data: data,
    }).code(200);

    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: 'fail',
      message: 'Terjadi kesalahan dalam mengambil data prediksi',
    }).code(500);
    
    return response;
  }
}

module.exports = { postPredictHandler, getPredictHistories };
