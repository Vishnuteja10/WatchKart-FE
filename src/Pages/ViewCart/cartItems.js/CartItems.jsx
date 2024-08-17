import React, { useEffect, useState } from "react";
import style from "./CartItem.module.css";
import useProductContext from "../../../Hooks/useProductContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";

export default function CartItems() {
  const {
    item,
    productsData,
    setBuyNow,
    setTotalPrice,
    totalPrice,
    setIsCartEmpty,
    userId,
    setUserId,
    setNumOfCartItems,
    numOfCartItems
  } = useProductContext();
  const [numOfItems, setNumOfItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const rupeeSymbol = String.fromCharCode(8377);
  const { id } = useParams();

  const [loader, setLoader] = useState(true);

  const GET_CART_ITEMS = "https://watchkart-be.onrender.com/api/get-cartitems/";

  const REMOVE_CART_ITEM = "https://watchkart-be.onrender.com/api/removeItem/";

  useEffect(() => {
    const id = localStorage.getItem("userId");
    setUserId(id);
    getCartItems();
  }, [numOfCartItems]);

  useEffect(() => {
    if (numOfItems.length > 0) {
      calculateTotal();
    }
  }, [numOfItems]);

  const calculateTotal = () => {
    let sum = 0;
    let i = 0;
    for (const cartItem of cartItems) {
      sum = sum + cartItem?.price * numOfItems[i];
      i++;
    }
    setTotalPrice(sum);
  };

  const changeQuantityOfItems = (e, index) => {
    const itemsCopy = [...numOfItems];
    itemsCopy[index] = e.target.value;
    setNumOfItems(itemsCopy);
  };

  const getCartItems = async () => {
    axios.get(GET_CART_ITEMS + id).then(
      (response) => {
        console.log(response);
        if (response?.data?.success) {
          const cartItems = response?.data?.data;
          setLoader(false);

          if (cartItems.length == 0) {
            setIsCartEmpty(true);
          } else {
            setIsCartEmpty(false);
            setNumOfCartItems(cartItems?.length);
          }
          const quantityArray = cartItems.map((item) => item.quantity);
          setNumOfItems(quantityArray);
          setCartItems(cartItems);
          calculateTotal();
        }
      },
      (error) => {
        setLoader(false);
        alert("failed to get cart items");
      }
    );
  };

  const removeItem = (e, user, item) => {
    e.preventDefault();

    axios.delete(REMOVE_CART_ITEM + user + "/" + item).then(
      (response) => {
        if (response?.data?.success) {
          setNumOfCartItems(numOfCartItems - 1);
          alert("item removed from cart");
        } else {
          alert("failed to remove item from cart");
        }
      },
      (error) => {
        console.log(error);
        alert("failed to remove item from cart");
      }
    );
  };

  return (
    <div className={style.main}>
      {loader ? (
        <div className={style.loader}>
          <ClipLoader
            color={"black"}
            loading={loader}
            cssOverride={{ marginTop: "7vw", marginLeft: "30vw" }}
          />
        </div>
      ) : (
        <div className={style.items}>
          {cartItems?.map((item, index) => (
            <div>
              <div className={style.productDetails}>
                <div className={style.imageContainer}>
                  <img src={item?.images[0]} />
                </div>

                <div>
                  <div className={style.orderDetails}>
                    <div className={style.itemNameInfo}>
                      <div className={style.header}>{item?.name}</div>
                      <div className={style.itemInfo}>
                        <div>color : {item?.color}</div>
                        <div>{item?.available}</div>
                      </div>
                    </div>
                    <div className={style.priceContainer}>
                      <div className={style.header}>Price</div>
                      <div className={style.header}>
                        {rupeeSymbol}
                        {item?.price}
                      </div>
                    </div>
                    <div className={style.quantityInfo}>
                      <div className={style.header}>Quantity</div>
                      <div>
                        <select
                          name="numOfitems"
                          className={style.numOfitems}
                          value={numOfItems[index] || 1}
                          onChange={(e) => {
                            changeQuantityOfItems(e, index);
                          }}
                        >
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                          <option value={5}>5</option>
                        </select>
                      </div>
                    </div>
                    <div className={style.totalContainer}>
                      <div className={style.header}>Total</div>
                      <div className={style.header}>
                        {rupeeSymbol}
                        {item?.price * numOfItems[index]}
                      </div>
                    </div>

                    <div className={style.removeItemContainer}>
                      <button
                        onClick={(e) => removeItem(e, item?.userId, item?._id)}
                      >
                        remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <span className={style.itemQuantity}>
                  {numOfItems[index]} Item
                </span>
                <span className={style.itemPrice}>
                  {rupeeSymbol}
                  {item?.price * numOfItems[index]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className={style.priceDetails}>
        <div>
          <div className={style.header}>PRICE DETAILS</div>
          <div className={style.container}>
            <span className={style.label}>Total MRP</span>
            <span className={style.value}>
              {" "}
              {rupeeSymbol}
              {totalPrice}
            </span>
          </div>

          <div className={style.container}>
            <span className={style.label}>Discount on MRP</span>
            <span className={style.discountValue}> {rupeeSymbol}0</span>
          </div>

          <div className={style.container}>
            <span className={style.label}>Convinience Fee</span>
            <span className={style.feeValue}> {rupeeSymbol}45</span>
          </div>

          <div className={style.totalAmount}>
            <div className={style.container}>
              <span className={style.label}>Total Amount</span>
              <span className={style.amountValue}>
                {" "}
                {rupeeSymbol}
                {totalPrice + 45}
              </span>
            </div>
            <div>
              <button
                className={style.placeOrder}
                onClick={() => {
                  setBuyNow(false);
                  navigate(`/checkout/${userId}`, { state: { totalPrice } });
                }}
              >
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
