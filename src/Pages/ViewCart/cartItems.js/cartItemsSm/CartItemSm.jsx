import React from "react";
import useProductContext from "../../../../Hooks/useProductContext";
import style from "./CartItemSm.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ClipLoader } from "react-spinners";

export default function CartItemSm() {
  const {
    item,
    totalPrice,
    setTotalPrice,
    setIsCartEmpty,
    setNumOfCartItems,
    isCartEmpty,
    setUserId,
    userId,
    numOfCartItems
  } = useProductContext();
  const [cartItems, setCartItems] = useState([]);
  const rupeeSymbol = String.fromCharCode(8377);
  const navigate = useNavigate();
  const { id } = useParams();

  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setUserId(id);
    getCartItems();
  }, [isCartEmpty, numOfCartItems]);

  const calculateTotal = (items) => {
    let sum = 0;
    for (const cartItem of items) {
      sum = sum + cartItem?.price;
    }
    setTotalPrice(sum);
  };

  const GET_CART_ITEMS = "https://watchkart-be.onrender.com/api/get-cartitems/";

  const REMOVE_CART_ITEM = "https://watchkart-be.onrender.com/api/removeItem/";

  const getCartItems = async () => {
    axios.get(GET_CART_ITEMS + id).then(
      (respones) => {
        if (respones?.data?.success) {
          const cartItems = respones?.data?.data;
          setLoader(false);
          if (cartItems.length == 0) {
            setIsCartEmpty(true);
          } else {
            setIsCartEmpty(false);
            setNumOfCartItems(cartItems?.length);
            calculateTotal(cartItems);
          }
          setCartItems(respones?.data?.data);
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
    <div>
      <div>
        {loader ? (
          <div className={style.loader}>
            <ClipLoader
              color={"black"}
              loading={loader}
              cssOverride={{ marginTop: "7vw", marginLeft: "30vw" }}
            />
          </div>
        ) : (
          <div className={style.allCartItems}>
            {cartItems?.map((item, index) => (
              <div className={style.productDetails}>
                <div className={style.imageContainer}>
                  <img src={item?.images[0]} />
                </div>
                <div className={style.orderDetails}>
                  <div className={style.itemNameInfo}>
                    <div className={style.header}>{item?.name}</div>
                    <div className={style.header}>
                      {rupeeSymbol} {item?.price}
                    </div>
                    <div>color : {item?.color}</div>
                    <div>{item?.available}</div>
                    <div className={style.removeItemContainer}>
                      {" "}
                      <button
                        onClick={(e) => removeItem(e, item?.userId, item?._id)}
                      >
                        remove
                      </button>{" "}
                    </div>
                    {index == cartItems.length - 1 ? (
                      <div>
                        <div className={style.fee}>
                          convenience fee : {rupeeSymbol}
                          {45}
                        </div>
                        <div className={style.totalAmount}>
                          Total :{rupeeSymbol} {totalPrice + 45}{" "}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={style.priceDetails}>
          <div className={style.container}>
            <span className={style.label}>Total Amount</span>
            <span className={style.amountValue}>
              {rupeeSymbol}
              {totalPrice + 45}
            </span>
          </div>
          <div>
            <button
              onClick={() => navigate(`/checkout/${userId}`)}
              className={style.placeOrder}
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
