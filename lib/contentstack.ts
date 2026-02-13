import Contentstack from 'contentstack';

// Region configurations
const REGION = (process.env.CONTENTSTACK_REGION || 'us').toLowerCase();

const stackConfig: any = {
  api_key: process.env.CONTENTSTACK_API_KEY!,
  delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN!,
  environment: process.env.CONTENTSTACK_ENVIRONMENT || 'production',
};

// Use custom CDN if provided, otherwise use region
if (process.env.CONTENTSTACK_CDN) {
  stackConfig.region = REGION;
} else {
  stackConfig.region = REGION;
}

const Stack = Contentstack.Stack(stackConfig);

export interface ContactMethod {
  title: string;
  value: string;
  icon_type: 'email' | 'phone' | 'address';
  order: number;
}

export async function getContactMethods(): Promise<ContactMethod[]> {
  try {
    const Query = Stack.ContentType('contact_method').Query();
    
    const result = await Query
      .ascending('order')
      .toJSON()
      .find();

    if (result && result[0]) {
      return result[0].map((item: any) => ({
        title: item.title || '',
        value: item.value || '',
        icon_type: item.icon_type || 'email',
        order: item.order || 0,
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching contact methods from ContentStack:', error);
    return [];
  }
}

