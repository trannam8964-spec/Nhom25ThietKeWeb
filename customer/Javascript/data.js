let products = [
  {
    id: "CF01",
    name: "Cà phê nâu",
    price: 30000,
    category: "Cà phê",
    sold: 35,
    description: "Cà phê đậm đà hòa cùng sữa đặc béo thơm, tạo nên vị ngọt dịu và hậu vị nồng nàn quen thuộc.",
    rating: 4.8,
    image: "../../Menu/Cà Phê/nau.jpg",
  },

  {
    id: "CF02",
    name: "Cà phê muối",
    price: 35000,
    category: "Cà phê",
    sold: 42,
    description: "Lớp cà phê thơm mạnh quyện với kem muối mằn mặn, béo mượt; nhấp một ngụm là vị đắng và vị ngọt cân bằng đầy cuốn hút.",
    rating: 4.9,
    image: "../../Menu/Cà Phê/muoi.jpg",
  },

  {
    id: "CF03",
    name: "Mocha",
    price: 40000,
    category: "Cà phê",
    sold: 28,
    description: "Cà phê espresso đậm vị gặp chocolate và sữa mềm mịn, thơm ngậy nhưng vẫn giữ chút đắng tinh tế nơi cuối vị.",
    rating: 4.7,
    image: "../../../Menu/Cà Phê/mocha.jpg",
  },

  {
    id: "CF04",
    name: "Cà phê kem trứng",
    price: 40000,
    category: "Cà phê",
    sold: 31,
    description: "Cà phê đậm thơm được phủ lớp kem trứng vàng óng, béo mịn và thoảng hương trứng ngọt dịu như một món tráng miệng.",
    rating: 4.8,
    image: "../../Menu/Cà Phê/kemtrung.jpg",
  },

  {
    id: "CF05",
    name: "Espresso",
    price: 30000,
    category: "Cà phê",
    sold: 20,
    description: "Một shot espresso nhỏ gọn với hương rang nồng, vị đắng rõ nét và hậu vị kéo dài dành cho người mê cà phê nguyên bản.",
    rating: 4.7,
    image: "../../Menu/Cà Phê/espresso.jpg",
  },

  {
    id: "CF06",
    name: "Cà Phê Đen",
    price: 25000,
    category: "Cà phê",
    sold: 10,
    description: "Cà phê đen nguyên chất thơm sâu, đắng đậm và tỉnh táo; càng nhấp chậm càng cảm nhận rõ vị rang mộc mạc.",
    rating: 4.6,
    image: "../../Menu/Cà Phê/den.jpg",
  },

  {
    id: "CF07",
    name: "Cà Phê Cốt Dừa",
    price: 35000,
    category: "Cà phê",
    sold: 30,
    description: "Cà phê thơm đậm hòa với cốt dừa béo ngậy, thêm chút ngọt mát tạo nên từng ngụm sánh mịn, thơm bùi.",
    rating: 4.8,
    image: "../../Menu/Cà Phê/cotdua.jpg",
  },

  {
    id: "CF08",
    name: "Cappucino",
    price: 35000,
    category: "Cà phê",
    sold: 15,
    description: "Espresso đậm thơm nằm dưới lớp sữa nóng mịn màng, điểm chút bọt sữa nhẹ nhàng cho vị cân bằng và êm dịu.",
    rating: 4.7,
    image: "../../Menu/Cà Phê/capuchinno.jpg",
  },

  {
    id: "CF09",
    name: "Bạc Xỉu",
    price: 25000,
    category: "Cà phê",
    sold: 50,
    description: "Sữa đặc thơm béo nâng đỡ vị cà phê đậm, ngọt vừa và dịu hơn cà phê sữa, hợp cho buổi sáng thong thả.",
    rating: 4.9,
    image: "../../Menu/Cà Phê/bacxiu.jpg",
  },

  {
    id: "CF10",
    name: "Americano",
    price: 30000,
    category: "Cà phê",
    sold: 40,
    description: "Cà phê pha cùng nước nóng cho vị nhẹ và thanh hơn espresso, hương rang vẫn rõ, hậu vị sạch và dễ uống.",
    rating: 4.7,
    image: "../../Menu/Cà Phê/americano.jpg",
  },

  // =========================
  // ĐỒ ĂN
  // =========================

  {
    id: "DA01",
    name: "Khô gà",
    price: 15000,
    category: "Đồ ăn",
    sold: 24,
    description: "Sợi gà xé dai mềm thấm vị mặn ngọt, thơm cay vừa phải và càng nhâm nhi càng bắt miệng.",
    rating: 4.7,
    image: "../../Menu/Đồ Ăn/Khoga.jpg",
  },

  {
    id: "DA02",
    name: "Khô bò",
    price: 15000,
    category: "Đồ ăn",
    sold: 29,
    description: "Thịt bò khô dai thơm, đậm vị cay ngọt và thoảng hương gia vị, là món nhâm nhi đầy cuốn hút bên ly nước yêu thích.",
    rating: 4.8,
    image: "../../Menu/Đồ Ăn/khobo.jpg",
  },

  {
    id: "DA03",
    name: "Hướng dương",
    price: 10000,
    category: "Đồ ăn",
    sold: 17,
    description: "Hạt hướng dương rang giòn bùi, thơm nhẹ và vừa miệng, thích hợp để nhâm nhi trong những cuộc trò chuyện dài.",
    rating: 4.6,
    image: "../../Menu/Đồ Ăn/HuongDuong.jpg",
  },

  {
    id: "DA04",
    name: "Flan caramel",
    price: 25000,
    category: "Đồ ăn",
    sold: 36,
    description: "Bánh flan mềm mịn, thơm vị trứng sữa và phủ caramel ngọt đắng dịu, tan nhẹ trong miệng sau mỗi thìa.",
    rating: 4.8,
    image: "../../Menu/Đồ Ăn/flanCaramel.jpg",
  },

  {
    id: "DA05",
    name: "Croissant bơ tỏi",
    price: 35000,
    category: "Đồ ăn",
    sold: 21,
    description: "Croissant vàng giòn bên ngoài, mềm xốp bên trong, quyện hương bơ thơm lừng cùng lớp tỏi đậm đà.",
    rating: 4.7,
    image: "../../Menu/Đồ Ăn/croissantBoToi.jpg",
  },

  {
    id: "DA06",
    name: "Cơm cháy chà bông",
    price: 30000,
    category: "Đồ ăn",
    sold: 27,
    description: "Cơm cháy giòn rụm phủ chà bông mặn thơm, hòa cùng chút sốt đậm vị tạo nên món ăn vặt giòn ngon khó dừng.",
    rating: 4.8,
    image: "../../Menu/Đồ Ăn/comchaychabong.jpg",
  },

  {
    id: "DA07",
    name: "Bông lan trứng muối",
    price: 40000,
    category: "Đồ ăn",
    sold: 33,
    description: "Cốt bánh bông lan mềm ẩm kết hợp trứng muối bùi mặn và lớp sốt béo thơm, tạo nên vị mặn ngọt hài hòa.",
    rating: 4.9,
    image: "../../Menu/Đồ Ăn/bonglantrungmuoi.jpg",
  },

  // =========================
  // NƯỚC ÉP
  // =========================

  {
    id: "NE01",
    name: "Nước ép dưa hấu",
    price: 35000,
    category: "Nước ép",
    sold: 32,
    description: "Dưa hấu mọng nước được ép tươi, ngọt thanh và mát lành, giữ trọn hương vị trái cây cho ngày thêm sảng khoái.",
    rating: 4.8,
    image: "../../Menu/Nước Ép/duahau.jpg",
  },

  {
    id: "NE02",
    name: "Nước ép dứa",
    price: 40000,
    category: "Nước ép",
    sold: 26,
    description: "Dứa chín thơm nồng với vị ngọt đậm xen chút chua dịu, đem lại cảm giác tươi mát và đầy sức sống.",
    rating: 4.7,
    image: "../../Menu/Nước ép/dua.jpg",
  },

  {
    id: "NE03",
    name: "Nước ép cam",
    price: 35000,
    category: "Nước ép",
    sold: 39,
    description: "Cam tươi chua ngọt hài hòa, thơm mọng và sảng khoái; một lựa chọn rực rỡ cho những lúc cần nạp năng lượng.",
    rating: 4.9,
    image: "../../Menu/Nước ép/cam.jpg",
  },

  // =========================
  // TRÀ
  // =========================

  {
    id: "TR01",
    name: "Trà xoài",
    price: 35000,
    category: "Trà",
    sold: 30,
    description: "Trà thơm dịu kết hợp vị xoài chín ngọt đậm và chút chua thanh, mang đến cảm giác tươi mát trong từng ngụm.",
    rating: 4.7,
    image: "../../Menu/Trà/traxoai.jpg",
  },

  {
    id: "TR02",
    name: "Trà vải hoa lài",
    price: 40000,
    category: "Trà",
    sold: 45,
    description: "Vải ngọt mọng hòa cùng hương hoa lài thanh tao, thơm nhẹ mà quyến rũ, để lại hậu vị dịu dàng khó quên.",
    rating: 4.9,
    image: "../../Menu/Trà/travaihoalai.jpg",
  },

  {
    id: "TR03",
    name: "Trà tắc xí muội",
    price: 35000,
    category: "Trà",
    sold: 23,
    description: "Vị trà thanh quyện với tắc chua thơm và xí muội mặn ngọt, tạo nên thức uống đậm đà, kích thích vị giác.",
    rating: 4.7,
    image: "../../Menu/Trà/tratacximuoi.jpg",
  },

  {
    id: "TR04",
    name: "Trà mãng cầu",
    price: 40000,
    category: "Trà",
    sold: 41,
    description: "Mãng cầu chua ngọt thơm mềm kết hợp nền trà thanh mát, cho vị trái cây đậm đà mà vẫn nhẹ nhàng dễ uống.",
    rating: 4.8,
    image: "../../Menu/Trà/tramangcau.jpg",
  },

  {
    id: "TR05",
    name: "Trà đào cam sả",
    price: 40000,
    category: "Trà",
    sold: 38,
    description: "Đào ngọt dịu, cam thơm tươi và sả thoảng hương ấm cùng hòa trong nền trà thanh, tạo nên vị cân bằng đầy cuốn hút.",
    rating: 4.9,
    image: "../../Menu/Trà/tradaocamsa.jpg",
  },

  {
    id: "TR06",
    name: "Sen vàng",
    price: 35000,
    category: "Trà",
    sold: 19,
    description: "Hương trà thanh tao kết hợp vị sen dịu ngọt và chút bùi thơm, mang đến cảm giác thư thái, nhẹ nhàng.",
    rating: 4.7,
    image: "../../Menu/Trà/senvang.jpg",
  },

  {
    id: "TR07",
    name: "Hồng trà việt quất",
    price: 40000,
    category: "Trà",
    sold: 34,
    description: "Hồng trà đậm hương quyện cùng việt quất chua ngọt, thơm trái cây và có hậu vị tươi mới, nổi bật.",
    rating: 4.8,
    image: "../../Menu/Trà/hongtravietquat.jpg",
  },

  // =========================
  // TRÀ SỮA
  // =========================

  {
    id: "TS01",
    name: "Trà sữa việt quất",
    price: 40000,
    category: "Trà sữa",
    sold: 37,
    description: "Trà sữa thơm béo kết hợp việt quất chua ngọt, cho vị trà dịu dàng và hương trái cây nổi bật.",
    rating: 4.7,
    image: "../../Menu/Trà sữa/tsvietquat.jpg",
  },

  {
    id: "TS02",
    name: "Trà sữa socola",
    price: 40000,
    category: "Trà sữa",
    sold: 43,
    description: "Trà sữa béo mượt hòa cùng chocolate thơm đậm, ngọt ngào vừa đủ và lưu lại dư vị cacao quyến rũ.",
    rating: 4.8,
    image: "../../Menu/Trà sữa/tsSocola.jpg",
  },

  {
    id: "TS03",
    name: "Trà sữa matcha",
    price: 45000,
    category: "Trà sữa",
    sold: 48,
    description: "Matcha thơm đặc trưng gặp vị sữa béo dịu, cân bằng giữa chút đắng thanh và ngọt mượt trong từng ngụm.",
    rating: 4.9,
    image: "../../Menu/Trà sữa/tsmatcha.jpg",
  },

  {
    id: "TS04",
    name: "Trà sữa chanh leo",
    price: 40000,
    category: "Trà sữa",
    sold: 29,
    description: "Vị trà sữa béo nhẹ hòa cùng chanh leo chua thơm, tạo cảm giác tươi mới và cân bằng, không ngấy.",
    rating: 4.7,
    image: "../../Menu/Trà sữa/tsChanhLeo.jpg",
  },

  {
    id: "TS05",
    name: "Trà sữa trân châu đường đen",
    price: 45000,
    category: "Trà sữa",
    sold: 52,
    description: "Trà sữa thơm béo kết hợp trân châu dai mềm phủ đường đen caramel, đậm đà, ngọt thơm và đầy đặn.",
    rating: 4.9,
    image: "../../Menu/Trà sữa/tranchauduongden.jpg",
  },
];

const managerToCustomerProductIds = {
  P001: "CF10",
  P002: "CF09",
  P003: "CF08",
  P004: "CF07",
  P005: "CF06",
  P006: "CF05",
  P007: "CF04",
  P008: "CF03",
  P009: "CF02",
  P010: "CF01",
  P011: "DA07",
  P012: "DA06",
  P013: "DA05",
  P014: "DA04",
  P015: "DA03",
  P016: "DA02",
  P017: "DA01",
  P018: "NE03",
  P019: "NE02",
  P020: "NE01",
  P021: "TR07",
  P022: "TR06",
  P023: "TR05",
  P024: "TR04",
  P025: "TR03",
  P026: "TR02",
  P027: "TR01",
  P028: "TS05",
  P029: "TS04",
  P030: "TS03",
  P031: "TS02",
  P032: "TS01",
};

function loadCoffeeProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem("hoianCoffeeProducts") || "[]");
    if (Array.isArray(saved) && saved.length) {
      const bundledDescriptions = new Map(
        products.map((product) => [product.id, product.description]),
      );
      let descriptionsUpdated = false;
      const savedWithDescriptions = saved.map((product) => {
        const fallbackId = managerToCustomerProductIds[product.id];
        const description = String(product.description || "").trim()
          ? product.description
          : bundledDescriptions.get(fallbackId) || "";
        if (description !== product.description) descriptionsUpdated = true;
        return { ...product, description };
      });

      if (descriptionsUpdated) {
        try {
          localStorage.setItem(
            "hoianCoffeeProducts",
            JSON.stringify(savedWithDescriptions),
          );
        } catch {
          // The customer menu can still display the fallback descriptions in memory.
        }
      }
      return savedWithDescriptions
        .filter((product) => product.active !== false)
        .map((product) => ({
          ...product,
          image: product.image?.startsWith("/")
            ? product.image
            : "/manager/lyna7200/coffe/" + String(product.image || ""),
          sold: Number(product.sold) || 0,
          rating: Number(product.rating) || 4.7,
        }));
    }
  } catch {
    // Use the bundled menu if the manager catalog is not available yet.
  }
  return products;
}

products = loadCoffeeProducts();
window.loadCoffeeProducts = loadCoffeeProducts;
