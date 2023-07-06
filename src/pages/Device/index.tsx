import React, { useState } from "react";
import { BookWithId } from "../../features/deviceSlice";
import Device from "./Device";

const List = () => {
  const [bookToEdit, setBookToEdit] = useState<BookWithId | null>(null);

  const handleEditIcon = (book: BookWithId) => {
    setBookToEdit(book);
  };
  return (
    <div>
      <Device bookToEdit={bookToEdit} handleEditIcon={handleEditIcon} />
    </div>
  );
};

export default List;
