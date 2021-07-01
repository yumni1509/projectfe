
package com.api;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class DbApi {
    
    static Connection con;
    static ResultSet rs;

    public static JSONObject registerNewUser(String email, String password) {
        JSONObject jo = new JSONObject();
        int ada = 0;
        try {
            con = ConMan.getConnection();
            String sql = "select * from register where email = ?";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, email);
            rs = ps.executeQuery();
            while (rs.next()) {
                ada = 1;
            }
            if (ada == 1) {//user already exists
                jo.put("status", 1);
            } else { //not yet exists, add user into table
                sql = "insert into register(email,password) values(?,?)";
                PreparedStatement ps2 = con.prepareStatement(sql);
                ps2.setString(1, email);
                ps2.setString(2, password);
                ps2.executeUpdate();
                jo.put("status", 0);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return jo;
    }

    public static JSONObject userAuthentication(String email, String pass) {
        JSONObject jo = new JSONObject();
        int ada = 0;
        try {
            con = ConMan.getConnection();
            String sql = "select * from register where email = ? and password = ?";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, email);
            ps.setString(2, pass);
            rs = ps.executeQuery();
            while (rs.next()) {
                ada = 1;
            }
            if (ada == 1) {//user already exists
                jo.put("status", 1);
            } else { //not yet exists, add user into table
                jo.put("status", 0);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return jo;
    }

    public static JSONArray getRecipeByOwner(String email) {
        JSONArray ja = new JSONArray();
        int index = 0;
        int ada = 0;
        try {
            con = ConMan.getConnection();
            String sql = "select * from recipe where owner = ?";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, email);
            rs = ps.executeQuery();
            while (rs.next()) {
                ada = 1;
                JSONObject jo = new JSONObject();
                jo.put("id", rs.getString("id"));
                jo.put("topic", rs.getString("topic"));
                jo.put("ingredient", rs.getString("ingredient"));
                jo.put("step", rs.getString("step"));
                ja.add(index++, jo);
            }
            if (ada == 1) {//ada data contacts
                JSONObject jo = new JSONObject();
                jo.put("status", 1);
                ja.add(index++, jo);
            } else {//tiada data contacts
                JSONObject jo = new JSONObject();
                jo.put("status", 0);
                ja.add(index++, jo);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ja;
    }

    public static JSONObject addRecipe(String topic, String ingredient, String step, String owner) {
        JSONObject jo = new JSONObject();
        try {
            con = ConMan.getConnection();
            String sql = "insert into recipe (topic, ingredient, step, owner) values (?,?,?,?)";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, topic);
            ps.setString(2, ingredient);
            ps.setString(3, step);
            ps.setString(4, owner);
            ps.executeUpdate();
            jo.put("status", 1);

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return jo;
    }
    
    public static JSONObject getRecipeById(String id) {
        JSONObject jo = new JSONObject();
        int index = 0;
        int ada = 0;
        try {
            con = ConMan.getConnection();
            String sql = "select * from recipe where id= ?";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, id);
            rs = ps.executeQuery();
            while (rs.next()) {
                ada = 1;
                
                jo.put("id", rs.getString("id"));
                jo.put("topic", rs.getString("topic"));
                jo.put("ingredient", rs.getString("ingredient"));
                jo.put("step", rs.getString("step"));
                
            }
            if (ada == 1) {//ada data contacts
                jo.put("status", 1);
            } else {//tiada data contacts
                jo.put("status", 0);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return jo;
    }
    
    public static JSONObject updateRecipeById(String topic, String ingredient, String step, String recipeid){
        JSONObject jo = new JSONObject();
        try {
            con = ConMan.getConnection();
            String sql = "update recipe set topic=?, ingredient=?, step=? where id=?";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, topic);
            ps.setString(2, ingredient);
            ps.setString(3, step);
            ps.setString(4, recipeid);
            ps.executeUpdate();
            jo.put("status", 1);

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return jo;
    }

    public static JSONObject delRecipeById (String recipeid){
        JSONObject jo = new JSONObject();
        try {
            con = ConMan.getConnection();
            String sql = "delete from recipe where id=?";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, recipeid);
            ps.executeUpdate();
            jo.put("status", 1);

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return jo;
    }
}
