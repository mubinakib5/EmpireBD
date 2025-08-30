import { CopyIcon, TrashIcon } from '@sanity/icons'
import { uuid } from '@sanity/uuid'

// Custom duplicate action for products
const duplicateAction = (props) => {
  const { id, type, draft, published } = props
  
  if (type !== 'product') {
    return null
  }

  return {
    label: 'Duplicate',
    icon: CopyIcon,
    onHandle: async () => {
      const { getClient } = await import('sanity')
      const client = getClient({ apiVersion: '2023-05-03' })
      
      try {
        // Get the current document
        const doc = await client.getDocument(published?._id || draft?._id || id)
        
        if (!doc) {
          throw new Error('Document not found')
        }
        
        // Create a new document with duplicated data
        const newId = uuid()
        const duplicatedDoc = {
          ...doc,
          _id: newId,
          _type: 'product',
          title: `${doc.title} (Copy)`,
          slug: {
            ...doc.slug,
            current: `${doc.slug?.current || doc.title.toLowerCase().replace(/\s+/g, '-')}-copy-${Date.now()}`
          }
        }
        
        // Remove system fields
        delete duplicatedDoc._rev
        delete duplicatedDoc._createdAt
        delete duplicatedDoc._updatedAt
        
        // Create the new document
        await client.create(duplicatedDoc)
        
        // Navigate to the new document
        props.onComplete()
        
        // Show success message
        console.log('Product duplicated successfully:', duplicatedDoc.title)
        
      } catch (error) {
        console.error('Error duplicating product:', error)
        alert(`Failed to duplicate product: ${error.message}`)
      }
    }
  }
}

// Custom delete action with confirmation
const deleteAction = (props) => {
  const { id, type, draft, published } = props
  
  if (type !== 'product') {
    return null
  }

  return {
    label: 'Delete',
    icon: TrashIcon,
    tone: 'critical',
    onHandle: async () => {
      const confirmed = window.confirm(
        'Are you sure you want to delete this product? This action cannot be undone.'
      )
      
      if (!confirmed) {
        return
      }
      
      const { getClient } = await import('sanity')
      const client = getClient({ apiVersion: '2023-05-03' })
      
      try {
        // Delete both draft and published versions
        const deletePromises = []
        
        if (draft?._id) {
          deletePromises.push(client.delete(draft._id))
        }
        
        if (published?._id) {
          deletePromises.push(client.delete(published._id))
        }
        
        if (deletePromises.length === 0 && id) {
          deletePromises.push(client.delete(id))
        }
        
        await Promise.all(deletePromises)
        
        // Navigate back to product list
        props.onComplete()
        
        // Show success message
        console.log('Product deleted successfully!')
        
      } catch (error) {
        console.error('Error deleting product:', error)
        alert(`Failed to delete product: ${error.message}`)
      }
    }
  }
}



// Export the document actions
export const documentActions = (prev, context) => {
  const { schemaType } = context
  
  if (schemaType === 'product') {
    // Keep default actions (like Publish) as primary, add custom actions to secondary menu
    return [
      ...prev.filter(action => 
        !['duplicate', 'delete'].includes(action.name)
      ),
      duplicateAction,
      deleteAction
    ]
  }
  
  return prev
}

export default documentActions