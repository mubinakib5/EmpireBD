import { orderBy } from 'lodash'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import { CheckmarkIcon, CloseIcon, ClockIcon } from '@sanity/icons'

// Custom structure for Sanity Studio
export const structure = (S, context) =>
  S.list()
    .title('Content')
    .items([
      // Products section
      S.listItem()
        .title('Products')
        .icon(() => '🛍️')
        .child(
          S.documentTypeList('product')
            .title('All Products')
            .filter('_type == "product"')
        ),
      
      // Hero Segments section with drag-and-drop ordering
      orderableDocumentListDeskItem({
        type: 'heroSegment',
        title: 'Hero Segments',
        icon: () => '🎯',
        S,
        context
      }),
      
      // Orders Management section
      S.listItem()
        .title('Orders Management')
        .icon(() => '📦')
        .child(
          S.list()
            .title('Orders')
            .items([
              // All Orders
              S.listItem()
                .title('All Orders')
                .icon(() => '📋')
                .child(
                  S.documentTypeList('order')
                    .title('All Orders')
                    .filter('_type == "order"')
                    .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                ),
              
              // Pending Orders
              S.listItem()
                .title('Pending Orders')
                .icon(() => '⏳')
                .child(
                  S.documentTypeList('order')
                    .title('Pending Orders')
                    .filter('_type == "order" && status == "pending"')
                    .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                ),
              
              // Confirmed Orders
              S.listItem()
                .title('Confirmed Orders')
                .icon(CheckmarkIcon)
                .child(
                  S.documentTypeList('order')
                    .title('Confirmed Orders')
                    .filter('_type == "order" && status == "confirmed"')
                    .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                ),
              
              // Processing Orders
              S.listItem()
                .title('Processing Orders')
                .icon(() => '⚙️')
                .child(
                  S.documentTypeList('order')
                    .title('Processing Orders')
                    .filter('_type == "order" && status == "processing"')
                    .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                ),
              
              // Shipped Orders
              S.listItem()
                .title('Shipped Orders')
                .icon(() => '🚚')
                .child(
                  S.documentTypeList('order')
                    .title('Shipped Orders')
                    .filter('_type == "order" && status == "shipped"')
                    .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                ),
              
              // Delivered Orders
              S.listItem()
                .title('Delivered Orders')
                .icon(() => '📬')
                .child(
                  S.documentTypeList('order')
                    .title('Delivered Orders')
                    .filter('_type == "order" && status == "delivered"')
                    .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                ),
              
              // Cancelled Orders
              S.listItem()
                .title('Cancelled Orders')
                .icon(CloseIcon)
                .child(
                  S.documentTypeList('order')
                    .title('Cancelled Orders')
                    .filter('_type == "order" && status == "cancelled"')
                    .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                ),
            ])
        ),
      
      // Reviews Management section
      S.listItem()
        .title('Reviews Management')
        .icon(() => '⭐')
        .child(
          S.list()
            .title('Reviews')
            .items([
              // All Reviews
              S.listItem()
                .title('All Reviews')
                .icon(() => '💬')
                .child(
                  S.documentTypeList('productReview')
                    .title('All Reviews')
                    .filter('_type == "productReview"')
                    .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                ),
              
              // Pending Reviews (need approval)
              S.listItem()
                .title('Pending Reviews')
                .icon(() => '⏳')
                .child(
                  S.documentTypeList('productReview')
                    .title('Pending Reviews')
                    .filter('_type == "productReview" && approved != true')
                    .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                ),
              
              // Approved Reviews
              S.listItem()
                .title('Approved Reviews')
                .icon(CheckmarkIcon)
                .child(
                  S.documentTypeList('productReview')
                    .title('Approved Reviews')
                    .filter('_type == "productReview" && approved == true')
                    .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                ),
            ])
        ),
      
      // Divider
      S.divider(),
      
      // All other document types that aren't explicitly handled above
      ...S.documentTypeListItems().filter(
        (listItem) => !['product', 'heroSegment', 'order', 'productReview'].includes(listItem.getId())
      ),
    ])