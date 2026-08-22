import * as cityDao from '../../../dao/city.dao.js';

/**
 * Creates a new city record.
 * @param {object} cityData
 */
export async function createCity(cityData) {
    return cityDao.createCity(cityData);
}

/**
 * Retrieves details of a specific city.
 * @param {string} id
 */
export async function getCity(id) {
    return cityDao.getCityById(id);
}

/**
 * Lists cities matching filter conditions.
 * @param {object} filters
 */
export async function getCities(filters) {
    return cityDao.listCities(filters);
}
