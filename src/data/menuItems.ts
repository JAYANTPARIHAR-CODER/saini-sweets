export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
}

export const menuItems: MenuItem[] = [
  // SWEETS
  { id: "s1", name: "Kaju Katli", description: "Premium cashew fudge with silver leaf", price: "₹80/100g", category: "SWEETS" },
  { id: "s2", name: "Gulab Jamun", description: "Soft milk dumplings in rose syrup", price: "₹12/pc", category: "SWEETS" },
  { id: "s3", name: "Rasmalai", description: "Creamy cottage cheese in saffron milk", price: "₹30/pc", category: "SWEETS" },
  { id: "s4", name: "Barfi", description: "Classic milk fudge with pistachios", price: "₹60/100g", category: "SWEETS" },
  { id: "s5", name: "Ladoo", description: "Traditional round sweets, besan or motichoor", price: "₹15/pc", category: "SWEETS" },
  { id: "s6", name: "Pinni", description: "Haryanvi specialty with desi ghee & dry fruits", price: "₹70/100g", category: "SWEETS" },
  // CHAAT
  { id: "c1", name: "Bhel Puri", description: "Puffed rice with tangy chutneys & sev", price: "₹50", category: "CHAAT" },
  { id: "c2", name: "Samosa Chaat", description: "Crushed samosa topped with yogurt & chutney", price: "₹60", category: "CHAAT" },
  { id: "c3", name: "Dahi Puri", description: "Crispy puris filled with sweet yogurt", price: "₹55", category: "CHAAT" },
  { id: "c4", name: "Pani Puri (6 pcs)", description: "Crispy puris with spiced mint water", price: "₹40", category: "CHAAT" },
  { id: "c5", name: "Papri Chaat", description: "Crispy papri with potatoes, chickpeas & curd", price: "₹55", category: "CHAAT" },
  { id: "c6", name: "Raj Kachori", description: "Giant crispy kachori with assorted fillings", price: "₹70", category: "CHAAT" },
  // SOUTH INDIAN
  { id: "si1", name: "Masala Dosa", description: "Crispy crepe with spiced potato filling", price: "₹80", category: "SOUTH INDIAN" },
  { id: "si2", name: "Plain Dosa", description: "Light & crispy rice crepe with sambar", price: "₹60", category: "SOUTH INDIAN" },
  { id: "si3", name: "Idli (3 pcs)", description: "Steamed rice cakes with coconut chutney", price: "₹50", category: "SOUTH INDIAN" },
  { id: "si4", name: "Vada (2 pcs)", description: "Crispy lentil fritters with sambar", price: "₹45", category: "SOUTH INDIAN" },
  { id: "si5", name: "Uttapam", description: "Thick rice pancake with vegetable toppings", price: "₹75", category: "SOUTH INDIAN" },
  { id: "si6", name: "Pav Bhaji", description: "Spiced mashed vegetables with buttered pav", price: "₹70", category: "SOUTH INDIAN" },
  // BEVERAGES
  { id: "b1", name: "Mango Lassi", description: "Creamy yogurt drink with fresh mango", price: "₹60", category: "BEVERAGES" },
  { id: "b2", name: "Sweet Lassi", description: "Traditional Haryanvi sweet yogurt drink", price: "₹40", category: "BEVERAGES" },
  { id: "b3", name: "Masala Chai", description: "Spiced Indian tea with cardamom & ginger", price: "₹20", category: "BEVERAGES" },
  { id: "b4", name: "Cold Coffee", description: "Chilled blended coffee with ice cream", price: "₹70", category: "BEVERAGES" },
  { id: "b5", name: "Fresh Lime Soda", description: "Refreshing lime with soda, sweet or salted", price: "₹40", category: "BEVERAGES" },

  //Namekken
  { id: "n1", name: "Aloo Bhujia", description: "Spicy potato-based crispy snack", price: "₹30/100g", category: "NAMKEEN" },
  { id: "n2", name: "Moong Dal", description: "Crunchy fried moong lentils with spices", price: "₹25/100g", category: "NAMKEEN" },
  { id: "n3", name: "Chana Jor Garam", description: "Spiced flattened black chickpeas", price: "₹35/100g", category: "NAMKEEN" },
  { id: "n4", name: "Sev", description: "Thin crispy noodles made from gram flour", price: "₹20/100g", category: "NAMKEEN" },
  { id: "n5", name: "Mathri", description: "Flaky fried crackers with carom seeds", price: "₹40/100g", category: "NAMKEEN" },
  { id: "n6", name: "Papad", description: "Crispy thin wafers made from lentil flour", price: "₹15/pc", category: "NAMKEEN" },
  // BAKERY
  { id: "bk1", name: "Samosa (2 pcs)", description: "Crispy pastry filled with spiced potatoes", price: "₹30", category: "BAKERY" },
  { id: "bk2", name: "Kachori (2 pcs)", description: "Flaky pastry with spiced lentil filling", price: "₹35", category: "BAKERY" },
  { id: "bk3", name: "Bread Pakora", description: "Bread slices dipped in gram flour batter & fried", price: "₹40", category: "BAKERY" },
  { id: "bk4", name: "Veg Puff", description: "Flaky puff pastry with vegetable filling", price: "₹25", category: "BAKERY" },
];

export const categories = ["ALL", "SWEETS", "CHAAT", "SOUTH INDIAN", "NAMKEEN", "BEVERAGES", "BAKERY"];
