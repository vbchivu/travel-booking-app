import { gql } from "apollo-server-express";

export const typeDefs = gql`
    type Booking {
        id: ID!
        userId: String!
        flightNumber: String!
        status: String!
        createdAt: String!
    }

    type Query {
        bookingById(id: ID!): Booking
        bookingsByUser(userId: String!): [Booking]
    }

    type Mutation {
        createBooking(userId: String!, flightNumber: String!): Booking
        updateBookingStatus(id: String!, status: String!): Booking
    }
`;
