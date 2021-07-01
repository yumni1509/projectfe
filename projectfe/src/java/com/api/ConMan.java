
package com.api;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConMan {
    
    static Connection con;
    static String url;
    
    public static Connection getConnection(){
        try{
            Class.forName("com.mysql.jdbc.Driver");
            try{
                url="jdbc:mysql://skimtech.my:3306/skimtech_group2";
                con=DriverManager.getConnection(url,"skimtech_group2","Skimtech_Group2@umt");
            }
            catch(SQLException e){
                e.printStackTrace();
            }
        }
        catch(ClassNotFoundException e){
            e.printStackTrace();
        }
        return con;
    }
}
