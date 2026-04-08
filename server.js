const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// API nguồn
const URL_TRUYEN_THONG = "https://wtx.tele68.com/v1/tx/sessions";
const URL_MD5 = "https://wtxmd52.tele68.com/v1/txmd5/sessions";

const HEADERS = {
  "User-Agent": "Mozilla/5.0",
  "Accept": "application/json"
};

// 👉 Hàm lấy dữ liệu + giữ nguyên JSON
async function getData() {
  try {
    const [tt, md5] = await Promise.all([
      axios.get(URL_TRUYEN_THONG, { headers: HEADERS }),
      axios.get(URL_MD5, { headers: HEADERS })
    ]);

    const dataTT = tt.data?.data?.[0] || {};
    const dataMD5 = md5.data?.data?.[0] || {};

    // 👉 GIỮ NGUYÊN FORMAT JSON
    return {
      Phien: dataTT.session || 0,
      Xuc_xac_1: dataTT.dice1 || 0,
      Xuc_xac_2: dataTT.dice2 || 0,
      Xuc_xac_3: dataTT.dice3 || 0,
      Tong: dataTT.total || 0,
      Ket_qua: dataTT.result || "UNKNOWN",

      phien_tiep_theo: (dataTT.session || 0) + 1,

      Du_doan: dataMD5.prediction || "UNKNOWN",

      Do_tin_cay: {
        "TÀI": dataMD5.tai || "50%",
        "XỈU": dataMD5.xiu || "50%"
      },

      ly_do: "MD5 + Tele68 Combined"
    };

  } catch (err) {
    return {
      error: "API lỗi",
      message: err.message
    };
  }
}

---

# 🔥 ROUTES

// Trang chủ (để test sống)
app.get("/", (req, res) => {
  res.send("🚀 API TÀI XỈU ĐANG CHẠY...");
});

// 👉 API CHÍNH
app.get("/taixiu", async (req, res) => {
  const data = await getData();
  res.json(data);
});

---

# 🔥 CHẠY SERVER

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
