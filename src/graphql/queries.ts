import { gql } from '@apollo/client/core';

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      productCode
      productName
      productLine
      productScale
      productVendor
      productDescription
      quantityInStock
      buyPrice
      MSRP
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($code: String!) {
    product(code: $code) {
      productCode
      productName
      productLine
      productScale
      productVendor
      productDescription
      quantityInStock
      buyPrice
      MSRP
    }
  }
`;
