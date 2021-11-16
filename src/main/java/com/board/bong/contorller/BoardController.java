package com.board.bong.contorller;

import com.board.bong.bean.*;
import com.board.bong.repository.BoardFileRepository;
import com.board.bong.repository.BoardRepository;
import com.board.bong.repository.CommentRepository;
import com.board.bong.repository.RecommendationRepository;
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
    @Autowired
    RecommendationRepository recommendationRepository;
    @GetMapping(path = "/getList")
    public List<Board> getList() {
        return boardRepository.findAll();
    }

    @PostMapping(path = "/addBoard")
    @Transactional
    public void addBoard(@RequestPart(value = "files", required = false) List<MultipartFile> files,
                         @RequestPart(value = "attachedFiles", required = false) List<MultipartFile> attachedFiles,
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
            if (files != null) {
                for (int i = 0; i < files.size(); i++) {
                    JSONObject jsonObj = (JSONObject) jsonArray.get(i);

                    boardFileRepository.save(new BoardFile(uuid, jsonObj.get("category").toString(),
                            jsonObj.get("type").toString(), Integer.parseInt(jsonObj.get("size").toString()), jsonObj.get("name").toString(),
                            new SerialBlob(files.get(i).getBytes())));
                }
            }

            jsonArray = (JSONArray) parser.parse( addBoardParam.attachedFilesAttrs );
            if (attachedFiles != null) {
                for (int i = 0; i < attachedFiles.size(); i++) {
                    JSONObject jsonObj = (JSONObject) jsonArray.get(i);
                    boardFileRepository.save(new BoardFile(uuid, jsonObj.get("category").toString(),
                            jsonObj.get("type").toString(), Integer.parseInt(jsonObj.get("size").toString()), jsonObj.get("name").toString(),
                            new SerialBlob(attachedFiles.get(i).getBytes())));
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
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
    public void editBoard(@RequestPart(value = "files", required = false) List<MultipartFile> files,
                         @RequestPart(value = "attachedFiles", required = false) List<MultipartFile> attachedFiles,
                         @ModelAttribute EditBoardParam editBoardParam) { //@RequestBody AddBoardParam addBoardParam
        Map<String,String> map = new HashMap<>();
        UUID uuid = UUID.randomUUID();
        Board board = boardRepository.findByid(UUID.fromString(editBoardParam.id));
        board.setTitle(editBoardParam.title);
        board.setContent(editBoardParam.content);
        board.setAuthor(editBoardParam.author);
        board.setTime(LocalDateTime.now());
        board.setComment(editBoardParam.comment);
        board.setCategory(editBoardParam.category);

        try {
            boardRepository.save(board);
//            boardRepository.save(new Board(UUID.fromString(editBoardParam.id), editBoardParam.title, editBoardParam.content,
//                    editBoardParam.author, LocalDateTime.now(), editBoardParam.comment, editBoardParam.category));
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
    }
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
        System.out.println("time,"+board.getTime());
        List<BoardFile> file = boardFileRepository.findByid(uuid);
        JSONArray jArray = new JSONArray();//배열이 필요할때
        //배열
        for (BoardFile boardFile : file) {
            JSONObject sObject = new JSONObject();//배열 내에 들어갈 json
            sObject.put("id", boardFile.getId());
            sObject.put("category", boardFile.getCategory());
            sObject.put("type", boardFile.getType());
            sObject.put("size", boardFile.getSize());
            sObject.put("name", boardFile.getName());
            Blob blob = boardFile.getFile();
//            sObject.put("file", file.get(i).getFile());
            int blobLength;
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
    }

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

    @PostMapping(path = "/deleteComment")
    @Transactional
    public void deleteComment(@RequestBody BoardIdParam boardIdParam) {
        UUID uuid = UUID.fromString(boardIdParam.id);
        commentRepository.deleteByid(uuid);
    }

    @PostMapping(path = "/recommend")
    public boolean recommend(@RequestBody RecommendParam recommendParam) {
        UUID uuid = UUID.randomUUID();
        boolean result = false;
        Recommendation recommendation = recommendationRepository.findByBoardIdAndUserIdAndType(
                UUID.fromString(recommendParam.boardId), recommendParam.userId, recommendParam.type);
        System.out.println("###"+recommendation);
        if (recommendation == null) {
            recommendationRepository.save(new Recommendation(uuid, UUID.fromString(recommendParam.boardId), recommendParam.userId,
                    "recommendation"));
            result = true;
        } else {
            recommendationRepository.deleteByid(recommendation.getId());
        }
        return result;
    }
    @PostMapping(path = "/decommend")
    public boolean decommend(@RequestBody RecommendParam recommendParam) {
        UUID uuid = UUID.randomUUID();
        boolean result = false;
        Recommendation recommendation = recommendationRepository.findByBoardIdAndUserIdAndType(
                UUID.fromString(recommendParam.boardId), recommendParam.userId, recommendParam.type);
        System.out.println("###"+recommendation);
        if (recommendation == null) {
            recommendationRepository.save(new Recommendation(uuid, UUID.fromString(recommendParam.boardId), recommendParam.userId,
                    "decommendation"));
            result = true;
        } else {
            recommendationRepository.deleteByid(recommendation.getId());
        }
        return result;
    }
    public static class RecommendParam {
        public String boardId;
        public String userId;
        public String type;
    }

    @PostMapping(path = "/boardRecommendById")
    @Transactional
    public void boardRecommendById(@RequestBody BoardRecommendParam boardRecommendParam) {
        boardRepository.updateRecommendation(
                UUID.fromString(boardRecommendParam.id),
                boardRecommendParam.recommendation,
                boardRecommendParam.decommendation);
    }
    public static class BoardRecommendParam {
        public String id;
        public int recommendation;
        public int decommendation;
    }
    @PostMapping(path = "/boardViewById")
    @Transactional
    public void boardViewById(@RequestBody BoardIdParam boardIdParam) {
        boardRepository.updateView(
                UUID.fromString(boardIdParam.id));
    }
    public static class BoardIdParam {
        public String id;
    }
    @GetMapping(path = "/getComment")
    public List<Comment> getComment(@RequestParam(value = "id") String id) {
        return commentRepository.findByboardId(UUID.fromString(id));
    }
    @GetMapping(path = "/deleteBoard")
    public void deleteBoard(@RequestParam(value = "id") String id) {
        UUID uuid = UUID.fromString(id);
        boardRepository.deleteById(uuid);
    }

    @GetMapping(path = "/getGroupByCategory")
    public List<BoardCntGroupByCategory> getGroupByCategory() {
        return boardRepository.findBoardCntGroupByCategory();
    }
}
