package com.board.bong.contorller;

import com.board.bong.bean.Board;
import com.board.bong.bean.BoardFile;
import com.board.bong.bean.Comment;
import com.board.bong.repository.BoardFileRepository;
import com.board.bong.repository.BoardRepository;
import com.board.bong.repository.CommentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import javax.transaction.Transactional;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping(path = "/board")
public class BoardController {
    @Autowired
    BoardRepository boardRepository;
    @Autowired
    BoardFileRepository boardFileRepository;
    @Autowired
    CommentRepository commentRepository;
    @GetMapping(path = "/getList")
    public List<Board> getList() {
        List<Board> resultList = boardRepository.findAll();
        return resultList;
    };
    @PostMapping(path = "/addBoard")
    @Transactional
    public void addBoard(@RequestPart(value = "files") List<MultipartFile> files,
                         @RequestPart(value = "attachedFiles") List<MultipartFile> attachedFiles,
                         @ModelAttribute AddBoardParam addBoardParam) { //@RequestBody AddBoardParam addBoardParam
        Map<String,String> map = new HashMap<>();
        map.put("title",addBoardParam.title);
        UUID uuid = UUID.randomUUID();

        try {
            boardRepository.save(new Board(uuid,addBoardParam.title, addBoardParam.content,
                    addBoardParam.author, addBoardParam.view, LocalDateTime.now(), addBoardParam.recommendation,
                    addBoardParam.decommendation, addBoardParam.comment, addBoardParam.category));
            JSONParser parser = new JSONParser();
            JSONArray jsonArray = (JSONArray) parser.parse( addBoardParam.filesAttrs );

            for (int i = 0; i < files.size(); i++) {
                JSONObject jsonObj = (JSONObject) jsonArray.get(i);

                boardFileRepository.save(new BoardFile(uuid, jsonObj.get("category").toString(),
                        jsonObj.get("type").toString(), Integer.parseInt(jsonObj.get("size").toString()), jsonObj.get("name").toString(),
                        new SerialBlob(files.get(i).getBytes())));
            }
            jsonArray = (JSONArray) parser.parse( addBoardParam.attachedFilesAttrs );
            for (int i = 0; i < attachedFiles.size(); i++) {
                JSONObject jsonObj = (JSONObject) jsonArray.get(i);
                boardFileRepository.save(new BoardFile(uuid, jsonObj.get("category").toString(),
                        jsonObj.get("type").toString(), Integer.parseInt(jsonObj.get("size").toString()), jsonObj.get("name").toString(),
                        new SerialBlob(attachedFiles.get(i).getBytes())));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    };
    public class AddBoardParam {
        private String title;
        private String content;
        private String author;
        private int view;
        private LocalDateTime time;
        private int recommendation;
        private int decommendation;
        private int comment;
        private String filesAttrs;
        private String attachedFilesAttrs;
        private String category;
        public void setTitle(String title) {
            this.title = title;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public void setAuthor(String author) {
            this.author = author;
        }

        public void setView(int view) {
            this.view = view;
        }

//        public void setTime(LocalDateTime time) {
//            this.time = time;
//        }

        public void setRecommendation(int recommendation) {
            this.recommendation = recommendation;
        }

        public void setDecommendation(int decommendation) {
            this.decommendation = decommendation;
        }

        public void setComment(int comment) {
            this.comment = comment;
        }

        public void setFilesAttrs(String filesAttrs) {
            this.filesAttrs = filesAttrs;
        }

        public void setAttachedFilesAttrs(String attachedFilesAttrs) {
            this.attachedFilesAttrs = attachedFilesAttrs;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        //        private Blob files;
//        private Blob attachedFiles;
    }
    public class FileAttr {
        private String name;
        private String category;
        private String type;
        private int size;
    }

    @PostMapping(path = "/editBoard")
    @Transactional
    public void editBoard(@RequestPart(value = "files") List<MultipartFile> files,
                         @RequestPart(value = "attachedFiles") List<MultipartFile> attachedFiles,
                         @ModelAttribute EditBoardParam editBoardParam) { //@RequestBody AddBoardParam addBoardParam
        Map<String,String> map = new HashMap<>();
        UUID uuid = UUID.randomUUID();
        Board board = boardRepository.findByid(UUID.fromString(editBoardParam.id));
        try {
            boardRepository.save(new Board(UUID.fromString(editBoardParam.id), editBoardParam.title, editBoardParam.content,
                    editBoardParam.author, editBoardParam.view, LocalDateTime.now(), editBoardParam.recommendation,
                    editBoardParam.decommendation, editBoardParam.comment, editBoardParam.category));
            JSONParser parser = new JSONParser();
            JSONArray jsonArray = (JSONArray) parser.parse( editBoardParam.filesAttrs );

            List<BoardFile> boardFile = boardFileRepository.findByid(UUID.fromString(editBoardParam.id));
//            for (int i = 0; i < boardFile.size();i++) {
//                boardFileRepository.deleteByid(UUID.fromString(editBoardParam.id));
//            }
            boardFileRepository.deleteByid(UUID.fromString(editBoardParam.id));
            for (int i = 0; i < files.size(); i++) {
                JSONObject jsonObj = (JSONObject) jsonArray.get(i);

                boardFileRepository.save(new BoardFile(UUID.fromString(editBoardParam.id), jsonObj.get("category").toString(),
                        jsonObj.get("type").toString(), Integer.parseInt(jsonObj.get("size").toString()), jsonObj.get("name").toString(),
                        new SerialBlob(files.get(i).getBytes())));
            }
            jsonArray = (JSONArray) parser.parse( editBoardParam.attachedFilesAttrs );
            for (int i = 0; i < attachedFiles.size(); i++) {
                JSONObject jsonObj = (JSONObject) jsonArray.get(i);
                boardFileRepository.save(new BoardFile(UUID.fromString(editBoardParam.id), jsonObj.get("category").toString(),
                        jsonObj.get("type").toString(), Integer.parseInt(jsonObj.get("size").toString()), jsonObj.get("name").toString(),
                        new SerialBlob(attachedFiles.get(i).getBytes())));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    };
    public class EditBoardParam {
        private String id;
        private String title;
        private String content;
        private String author;
        private int view;
        private LocalDateTime time;
        private int recommendation;
        private int decommendation;
        private int comment;
        private String filesAttrs;
        private String attachedFilesAttrs;
        private String category;

        public void setId(String id) {
            this.id = id;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public void setAuthor(String author) {
            this.author = author;
        }

        public void setView(int view) {
            this.view = view;
        }

//        public void setTime(LocalDateTime time) {
//            this.time = time;
//        }

        public void setRecommendation(int recommendation) {
            this.recommendation = recommendation;
        }

        public void setDecommendation(int decommendation) {
            this.decommendation = decommendation;
        }

        public void setComment(int comment) {
            this.comment = comment;
        }

        public void setFilesAttrs(String filesAttrs) {
            this.filesAttrs = filesAttrs;
        }

        public void setAttachedFilesAttrs(String attachedFilesAttrs) {
            this.attachedFilesAttrs = attachedFilesAttrs;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        //        private Blob files;
//        private Blob attachedFiles;
    }

    @GetMapping(path = "/getBoard")
    public JSONObject getBoard(@RequestParam(value = "id") String id) {
        UUID uuid = UUID.fromString(id);
        Board board = boardRepository.findByid(uuid);
        List<BoardFile> file = boardFileRepository.findByid(uuid);
        JSONArray jArray = new JSONArray();//배열이 필요할때
        for (int i = 0; i < file.size(); i++)//배열
        {
            JSONObject sObject = new JSONObject();//배열 내에 들어갈 json
            sObject.put("id", file.get(i).getId());
            sObject.put("category", file.get(i).getCategory());
            sObject.put("type", file.get(i).getType());
            sObject.put("size", file.get(i).getSize());
            sObject.put("name", file.get(i).getSize());
            Blob blob = file.get(i).getFile();
//            sObject.put("file", file.get(i).getFile());
            int blobLength = 0;
            try {
                blobLength = (int) blob.length();
                byte[] blobAsBytes = blob.getBytes(1, blobLength);
                blob.free();

                byte[] encodedBytes = Base64.getEncoder().encode(blobAsBytes);

                sObject.put("file", new String(encodedBytes));

            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
            jArray.add(sObject);
        }
        ObjectMapper mapper = new ObjectMapper();
        JSONObject map = new JSONObject();
        map.put("board",board);
        map.put("file",jArray);
        return map;
    };

    @PostMapping(path = "/addComment")
    public void addComment(@RequestBody AddCommentParam addCommentParam) {
        UUID uuid = UUID.fromString(addCommentParam.boardId);
        commentRepository.save(new Comment(UUID.fromString(addCommentParam.boardId), addCommentParam.text,
                addCommentParam.author, addCommentParam.time, addCommentParam.recommendation, addCommentParam.decommendation)
        );
    }
    public static class AddCommentParam {
        public String boardId;
        public String text;
        public String author;
        public LocalDateTime time;
        public int recommendation;
        public int decommendation;
    }

    @GetMapping(path = "/getComment")
    public List<Comment> getComment(@RequestParam(value = "id") String id) {
        List<Comment> resultList = commentRepository.findByboardId(UUID.fromString(id));
        return resultList;
    };
    @GetMapping(path = "/deleteBoard")
    public void deleteBoard(@RequestParam(value = "id") String id) {
        UUID uuid = UUID.fromString(id);
        boardRepository.deleteById(uuid);
    };
}
