import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "antd";
import { BookWithId } from "../features/deviceSlice";
import { useAppSelector } from "../hooks/storeHook";

interface RouteParams {
  [key: string]: string | undefined;
  id: string;
}

const ReadDevice: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const [book, setBook] = useState<BookWithId | null>(null);
  const booksArray: BookWithId[] | undefined = useAppSelector(
    (state) => state.books.booksArray
  );

  useEffect(() => {
    const selectedBook = booksArray?.find((book) => book.id === id);
    setBook(selectedBook ?? null);
  }, [booksArray, id]);

  return (
    <div>
      {book && (
        <Card title={book.book.tenTb}>
          <p>Mã thiết bị: {book.book.maTb}</p>
          <p>Địa chỉ: {book.book.diaChi}</p>
          <p>Loại thiết bị: {book.book.loaiTb}</p>
          <p>Mật khẩu: {book.book.matKhau}</p>
          <p>Tên đăng nhập: {book.book.tenDn}</p>
          <p>Dịch vụ sử dụng: {book.book.dvsd}</p>
        </Card>
      )}
    </div>
  );
};

export default ReadDevice;
