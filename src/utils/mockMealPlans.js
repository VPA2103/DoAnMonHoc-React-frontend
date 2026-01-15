export const MOCK_MEAL_PLANS = [
  {
    id: "1",
    title: "Kế hoạch giảm cân tuần 1",
    description: "Ăn cân đối, ít tinh bột, tăng rau và protein",
    duration: "7 ngày",
    meals: [
      {
        id: "m1",
        time: "Sáng",
        dishes: [
          { name: "Cháo yến mạch", calories: 300 },
          { name: "Trứng luộc", calories: 80 },
        ],
      },
      {
        id: "m2",
        time: "Trưa",
        dishes: [
          { name: "Cơm gạo lứt", calories: 350 },
          { name: "Ức gà nướng", calories: 220 },
          { name: "Rau luộc", calories: 50 },
        ],
      },
      {
        id: "m3",
        time: "Tối",
        dishes: [
          { name: "Salad cá hồi", calories: 350 },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Kế hoạch tăng cơ tuần 1",
    description: "Tăng calo và protein, chia nhỏ bữa",
    duration: "7 ngày",
    meals: [
      {
        id: "m4",
        time: "Sáng",
        dishes: [
          { name: "Bánh mì nguyên cám + bơ", calories: 420 },
          { name: "Sinh tố chuối", calories: 250 },
        ],
      },
      {
        id: "m5",
        time: "Trưa",
        dishes: [
          { name: "Cơm trắng", calories: 450 },
          { name: "Thịt bò xào", calories: 320 },
        ],
      },
      {
        id: "m6",
        time: "Tối",
        dishes: [
          { name: "Pasta cộng protein", calories: 600 },
        ],
      },
    ],
  },
];
