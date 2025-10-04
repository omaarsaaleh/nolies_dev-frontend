import {authenticatedApi} from './base'

export async function getCompanies(){
    const t = await authenticatedApi.get('/companies/');
    console.log(t);
    return t.data;
}