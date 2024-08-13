import { authClientInstance } from "../utils/http-client";

// 옷 검색하는 함수 getSearchedClothes
export const getSearchedClothes = async keyword => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await authClientInstance.get(`/api/clothes/search/${keyword}`);
    return response;
  } catch (error) {
    throw error;
  }
};

//옷 목록 조회하는 함수 getClothes
export const getClothes = async () => {
  return await authClientInstance
    .get("/api/clothes")
    .then(res => {
      console.log("res", res);
      return res;
    })
    .catch(e => {
      return e;
    });
};

//옷 삭제하는 함수
export const deleteClothes = async clothesId => {
  const { data, status } = await authClientInstance.delete(`/clothes/${clothesId}`);
  return { data, status };
};

//옷 정보 수정하는 함수
export const patchClothes = async (clothesId, clothesData) => {
  const { data, status } = await authClientInstance.patch(`/clothes/${clothesId}`, clothesData);
  return { data, status };
};

//NFC로 상세조회
export const getClothesByNfc = async nfcId => {
  const { data, status } = await authClientInstance.get(`/clothes/nfc/${nfcId}`);
  return { data, status };
};
