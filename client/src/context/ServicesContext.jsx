import { createContext } from "react";
import { request } from '../api';
export const ServicesContext= createContext();

export function ServicesProvider({children}){
const add_notice= async(form)=>{
    try{
        console.log("context form", form);
        if(!form){
            console.log("no notice is added");
            return;
        }
        else{
            const data = await request("/admin/notice",{
                method:"POST",
                body:JSON.stringify(form)
            }   
            )
            if(data){
                console.log("notice added",data);
                return data;
            }
        }
    }
    catch(error){
        console.log(error);
    }
}



const add_services= async(form)=>{
    try{
        if(!form){
            console.log("no service is added");
            return;
        }
        else{
            console.log("service context",form);
            const data= await request("/admin/services",{
                method:"POST",
                body:JSON.stringify(form)
            })
            if(data){
                console.log("servcie added",data);
            }
        }
    }
    catch(error){
        console.log(error);
    }
}


const add_organizations= async(form)=>{
    try{
        if(!form){
            console.log("no service is added");
            return;
        }
        else{
            console.log("service context",form);
            const data= await request("/admin/organizations",{
                method:"POST",
                body:JSON.stringify(form)
            })
            if(data){
                console.log("organization added",data);
            }
        }
    }
    catch(error){
        console.log(error);
    }
}

const get_notices = async () => {
    try {
        const data = await request('/public/notice');
        if (data) {
            console.log("data",data);
            return data;
        } else {
            console.log("no notice to show");
            return []; 
        }
    } catch (error) {
        console.error("Error fetching notices:", error);
        throw error; // Re-throw the error so the caller can handle it (e.g., show a UI alert)
    }
}

const get_services = async () => {
    try {
        console.log("service constext");
        const data = await request('/public/service');
        console.log("service data",data);
        if (data) {
            console.log("data",data);
            return data;
        } else {
            console.log("no notice to show");
            return []; 
        }
    } catch (error) {
        console.error("Error fetching services:", error);
        throw error; // Re-throw the error so the caller can handle it (e.g., show a UI alert)
    }
}

const get_organizations = async () => {
    try {
        const data = await request('/public/organization');
        if (data) {
            console.log("data",data);
            return data;
        } else {
            console.log("no notice to show");
            return []; 
        }
    } catch (error) {
        console.error("Error fetching organizations:", error);
        throw error; // Re-throw the error so the caller can handle it (e.g., show a UI alert)
    }
}

const get_Counts = async()=>{
    try{
        const data = await request("/admin/count");
        if(data){
            return data;
        }
        else{
            console.log("counts data missing");
        }
    }
    catch(error){
        console.log(error);
    }
}
return <ServicesContext.Provider value={{add_notice,add_services,add_organizations,get_notices, get_services, get_organizations, get_Counts}}>{children}</ServicesContext.Provider>
}

