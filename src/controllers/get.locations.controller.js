import query from './query.controller'
import errorMessage from './response.message.controller'
const getMap = async (req,res)=>{
  try {
      let response = await query(`SELECT
      CONCAT(
          '[',
          GROUP_CONCAT(
              JSON_OBJECT("id", province_id, "name", province_name, "districts",
                  COALESCE(districts, '[]'))
              ORDER BY province_id
              SEPARATOR ','
          ),
          ']'
      ) AS provinces
  FROM (
      SELECT
          p.id AS province_id,
          p.name AS province_name,
          CONCAT(
              '[',
              GROUP_CONCAT(
                  JSON_OBJECT("id", district_id, "name", district_name, "sectors",
                      COALESCE(sectors, '[]'))
                  ORDER BY district_id
                  SEPARATOR ','
              ),
              ']'
          ) AS districts
      FROM
          provinces p
          LEFT JOIN districts d ON p.id = d.province
          LEFT JOIN (
              SELECT
                  d.id AS district_id,
                  d.name AS district_name,
                  CONCAT(
                      '[',
                      GROUP_CONCAT(
                          JSON_OBJECT("id", sector_id, "name", sector_name, "cells",
                              COALESCE(cells, '[]'))
                          ORDER BY sector_id
                          SEPARATOR ','
                      ),
                      ']'
                  ) AS sectors
              FROM
                  districts d
                  LEFT JOIN sectors s ON d.id = s.district
                  LEFT JOIN (
                      SELECT
                          s.id AS sector_id,
                          s.name AS sector_name,
                          CONCAT(
                              '[',
                              GROUP_CONCAT(
                                 JSON_OBJECT("id", c.id, "name", c.name)
                                  ORDER BY c.id
                                  SEPARATOR ','
                              ),
                              ']'
                          ) AS cells
                      FROM
                          sectors s
                          LEFT JOIN cells c ON s.id = c.sector
                      GROUP BY
                          s.id, s.name
                  ) AS sector_data ON s.id = sector_data.sector_id
              GROUP BY
                  d.id, d.name
          ) AS district_data ON d.id = district_data.district_id
      GROUP BY
          p.id, p.name
  ) AS province_data
  GROUP BY
      province_id, province_name;
  `,[])
      if(!response) return res.status(500).send({success: false, message: errorMessage.is_error})
      for (const address of response) {
        response[response.indexOf(address)].provinces = JSON.parse(address.provinces)
    }
      res.send({success: true, message: response})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export default getMap