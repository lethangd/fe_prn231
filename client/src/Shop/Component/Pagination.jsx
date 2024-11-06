import React from "react";
import PropTypes from "prop-types";
import IndexPage from "./IndexPage";

Pagination.propTypes = {
  pagination: PropTypes.object,
  handlerChangePage: PropTypes.func,
  totalPage: PropTypes.number,
  totalCount: PropTypes.number, // Tổng số sản phẩm
};

Pagination.defaultProps = {
  pagination: {},
  handlerChangePage: null,
  totalPage: 1,
  totalCount: 0, // Mặc định không có sản phẩm
};

function Pagination(props) {
  const { pagination, handlerChangePage, totalPage, totalCount } = props;

  const { page, count } = pagination;

  let indexPage = [];

  // Tạo ra số nút bấm cho từng trang
  for (let i = 1; i <= totalPage; i++) {
    indexPage.push(i);
  }

  // Tính toán số sản phẩm đang hiển thị
  const startIndex = (page - 1) * count + 1;
  const endIndex = Math.min(page * count, totalCount);

  // Xử lý sự kiện chuyển trang
  const onDownPage = (value) => {
    if (!handlerChangePage) {
      return;
    }

    const newPage = Math.max(parseInt(value) - 1, 1);
    handlerChangePage(newPage);
  };

  const onUpPage = (value) => {
    if (!handlerChangePage) {
      return;
    }

    const newPage = Math.min(parseInt(value) + 1, totalPage);
    handlerChangePage(newPage);
  };

  return (
    <nav aria-label="Page navigation example" className="pt-5">
      <ul className="pagination justify-content-center justify-content-lg-end">
        <li className="page-item">
          <button
            className="page-link"
            onClick={() => onDownPage(page)}
            disabled={page <= 1}
          >
            <span>«</span>
          </button>
        </li>

        {/* Hiển thị các số trang */}
        <IndexPage
          indexPage={indexPage}
          handlerChangePage={handlerChangePage}
          pagination={pagination}
        />

        <li className="page-item">
          <button
            className="page-link"
            onClick={() => onUpPage(page)}
            disabled={page >= totalPage}
          >
            <span>»</span>
          </button>
        </li>
      </ul>

      {/* Hiển thị thông tin số sản phẩm đang xem */}
      <div className="pagination justify-content-center justify-content-lg-end">
        <p className="text-small text-muted mb-0">
          Showing {startIndex}–{endIndex} of {totalCount} results
        </p>
      </div>
    </nav>
  );
}

export default Pagination;
