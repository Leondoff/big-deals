import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import ConfirmationModal from "../../Shared/ConfirmationModal/ConfirmationModal";

const AllSellers = () => {
  const [deletingSeller, setDeletingSeller] = useState(null);

  //closing modal
  const closeModal = () => {
    setDeletingSeller(null);
  };

  //fetching data
  const {
    data: sellers = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["sellers"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/users?option=seller");
      const data = await res.json();
      return data;
    },
  });

  //spinner
  if (isLoading) {
    return <button className=" m-72 btn btn-square loading"></button>;
  }

  //verifying seller
  const handleVerification = (id) => {
    fetch(`http://localhost:5000/users/${id}`, {
      method: "PUT",
      headers: {
        authorization: `bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.modifiedCount > 0) {
          toast.success("Verified Successfully");
          refetch();
        }
      });
  };

  //implementing delete
  const handleDeleteSeller = (seller) => {
    fetch(`http://localhost:5000/users/${seller._id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.deletedCount > 0) {
          refetch();
          toast.success("deleted successfully");
        }
      });
  };
  return (
    <div>
      <h2 className="text-3xl my-6 text-center font-bold text-primary ">All Seller </h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Verify</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller, i) => (
              <tr className="hover" key={seller._id}>
                <th>{i + 1}</th>
                {seller?.status ? (
                  <td>{seller.name}✅</td>
                ) : (
                  <td>{seller.name}</td>
                )}
                {/* <td>{buyer.name}</td> */}
                <td>{seller.email}</td>
                {seller?.status ? (
                  <td>
                    <p className="text-green-400 font-semibold"> Verified</p>
                  </td>
                ) : (
                  <td>
                    <button
                      onClick={() => handleVerification(seller._id)}
                      className="btn btn-xs btn-primary"
                    >
                      Verify
                    </button>
                  </td>
                )}

                <td>
                  <label
                    onClick={() => setDeletingSeller(seller)}
                    htmlFor="confirmation-modal"
                    className="btn btn-xs btn-error"
                  >
                    Delete
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {deletingSeller && (
        <ConfirmationModal
          title={`Are you sure you want to delete?`}
          message={`If you delete ${deletingSeller.name}, it can't be undone.`}
          successAction={handleDeleteSeller}
          successButtonName="Delete"
          modalData={deletingSeller}
          closeModal={closeModal}
        ></ConfirmationModal>
      )}
    </div>
  );
};

export default AllSellers;
