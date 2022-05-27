const request = require("supertest");
const app = require("../app");
const truncate= require("../helpers/truncate");

const user = {
    username: "johndoe",
    password: "doe123"
};

const history = {
    score:30,
    score_date: "2020-05-05",
    user_id: 1
};

const bio = {
    name: "John Doe",
    age: 17,
    user_id: 1
};

describe("Test endpoint create history", () => {
    
    const invalidHistory = {
        score:30,
        score_date: "2020-05-05"
    };

    it("Should return 201 if successfully created", async () => {
        try {
            await request(app)
                .post("/api/v1/users")
                .send(user);

            const res = await request(app)
                .post("/api/v1/histories")
                .send(history)
                .set("auth", "secret");

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty("status", "Success");
            expect(res.body).toHaveProperty("message", "History created successfully")
            expect(res.body).toHaveProperty("data");
            expect(res.body.data.score).toBe(30);
            expect(res.body.data.score_date).toBe("2020-05-05T00:00:00.000Z");
            expect(res.body.data.user_id).toBe(1);
            await truncate.user();
            await truncate.history();
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });

    it("Should return 404 if user not found", async () => {
        try {
            const res = await request(app)
                .post("/api/v1/histories")
                .send(history)
                .set("auth", "secret");
            
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty("status", "error");
            expect(res.body).toHaveProperty("message", "User not found");
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });

    it("Should return 400 if all required input not filled", async () => {
        try {
            const res = await request(app)
                .post("/api/v1/histories")
                .send(invalidHistory)
                .set("auth", "secret");
            
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty("status", "Error");
            expect(res.body).toHaveProperty("message", "Please fill all the fields");
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });
});

describe("Test endpoint get history by user id", () => {
    it("Should return 404 if user doesn\'t exist", async () => {
        try {
            const res = await request(app)
                .get("/api/v1/histories/1")
                .set("auth", "secret");

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty("status", "error");
            expect(res.body).toHaveProperty("message", "User not found");
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });

    it("Should return 200 if succesfully retrieve user history", async () => {
        try {
            await request(app)
                .post("/api/v1/users")
                .send(user);
            
            await request(app)
                .post("/api/v1/histories")
                .send(history)
                .set("auth", "secret");

            const res = await request(app)
                .get("/api/v1/histories/1")
                .set("auth", "secret");

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("status", "Success");
            expect(res.body).toHaveProperty(
              "message",
              "History retrieved successfully"
            );
            expect(res.body).toHaveProperty("data");
            // expect array
            expect(res.body.data).toBeInstanceOf(Array);
            await truncate.user();
            await truncate.history();
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });
});

describe('Test endpoint update history', () => {
    it('Should return 404 if history not found', async () => {
        try {
            const res = await request(app)
              .put("/api/v1/histories/100")
              .set("auth", "secret")
              .send({
                score: 10,
                score_date: "2020-05-05",
                user_id: 1,
              });
      
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty("status", "error");
            expect(res.body).toHaveProperty("message", "History not found");
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });

    it('Should return 200 if history data succesfully updated', async () => {
        try {
            await request(app)
                .post("/api/v1/users")
                .send(user);

            await request(app)
                .post("/api/v1/histories")
                .send(history)
                .set("auth", "secret");
            
            const res = await request(app)
                .put("/api/v1/histories/1")
                .send({
                  score: 100,
                  score_date: "2020-05-05",
                  user_id: 1,
                })
                .set("auth", "secret");

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("status", "Success");
            expect(res.body).toHaveProperty(
              "message",
              "History updated successfully"
            );
            expect(res.body).toHaveProperty("data");
            expect(res.body.data.score).toBe(100);
            await truncate.user();
            await truncate.history();
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });
});

describe('Test endpoint delete history', () => {
    it('Should return 404 if history id not found', async () => {
        try {
            const res = await request(app)
              .delete("/api/v1/histories/1")
              .set("auth", "secret");
      
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty("status", "error");
            expect(res.body).toHaveProperty("message", "History not found");
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });

    it('Should return 200 if history succesfully deleted', async () => {
        try {
            await request(app)
                .post("/api/v1/users")
                .send(user);

            await request(app)
                .post("/api/v1/histories")
                .send(history)
                .set("auth", "secret");
                
            const res = await request(app)
                .delete("/api/v1/histories/1")
                .set("auth", "secret");
        
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("status", "Success");
            expect(res.body).toHaveProperty(
              "message",
              "History deleted successfully"
            );

            await truncate.user();
            await truncate.history();
            
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    })
});

// USER
describe('Test endpoint create user', () => {
    const invalidUser = {
        username:"johndoe"
    }

    it('Should return 400 if no username or password inputed', async () => {
        try {
            const res = await request(app)
                        .post('/api/v1/users')
                        .send(invalidUser);
    
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty("status", "Error");
            expect(res.body).toHaveProperty("message", "Please fill all the fields");
            await truncate.user();
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });

    it('Should return 201 if user succesfully created', async () => {
        try {
            const res = await request(app)
                        .post('/api/v1/users')
                        .send(user);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty("status", "Success");
            expect(res.body).toHaveProperty("message", "User created successfully");
            expect(res.body).toHaveProperty("data");
            expect(res.body.data.username).toBe("johndoe");
            expect(res.body.data.password).toBe("doe123");

            await truncate.user();
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });
});

describe('Test endpoint get all user', () => {
    it('Should return 200 if succesfully retrieve all users', async () => {
        try {
            const res = await request(app)
                        .get("/api/v1/users")
                        .set("auth", "secret");
      
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("status", "Success");
            expect(res.body).toHaveProperty(
              "message",
              "Users retrieved successfully"
            );
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });
});

describe('Test endpoint get specific user data', () => {
    it('Should return 404 if no user with selected id', async () => {
        try {
            const res = await request(app)
                        .get("/api/v1/users/1")
                        .set("auth", "secret")

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty("status", "Error");
            expect(res.body).toHaveProperty("message", "User not found");
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });

    it('Should return 200 if selected user is exist', async () => {
        try {
            await request(app)
                .post('/api/v1/users')
                .send(user);
    
            const res = await request(app)
                .get("/api/v1/users/1")
                .set("auth", "secret");
      
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("status", "Success");
            expect(res.body).toHaveProperty(
              "message",
              "User data retrieved successfully"
            );
            expect(res.body).toHaveProperty("data");
            expect(res.body.data.username).toBe("johndoe");
            expect(res.body.data.password).toBe("doe123");
            expect(res.body.data).toHaveProperty("bio");

            await truncate.user();
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });
});

describe('Test endpoint update user data', () => {
    const updateUser = {
        username: "johndoeUpdated"
    };
    it('Should return 404 if no user with selected id', async () => {
        try {
            const res = await request(app)
                        .put("/api/v1/users/1")
                        .set("auth", "secret")
                        .send(user)

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty("status", "Error");
            expect(res.body).toHaveProperty("message", "User not found");
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });

    it('Should return 200 if user succesfully updated', async () => {
        try {
            await request(app)
                .post('/api/v1/users')
                .send(user);

            const res = await request(app)
                .put("/api/v1/users/1")
                .set("auth", "secret")
                .send(updateUser);
        
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("status", "Success");
            expect(res.body).toHaveProperty("message", "User updated successfully");
            expect(res.body).toHaveProperty("data");
            expect(res.body.data.username).toBe("johndoeUpdated");
            expect(res.body.data.password).toBe("doe123");

            await truncate.user();
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });
});

describe('Test endpoint delete user data', () => {
    it('Should return 404 if no user with selected id', async () => {
        try {
            const res = await request(app)
                .delete("/api/v1/users/1")
                .set("auth", "secret");

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty("status", "Error");
            expect(res.body).toHaveProperty("message", "User not found");
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });

    it("Should return 200 if user deleted successfully", async () => {
        try {
            await request(app)
                .post('/api/v1/users')
                .send(user);

            const res = await request(app)
                .delete("/api/v1/users/1")
                .set("auth", "secret");
            
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("status", "Success");
            expect(res.body).toHaveProperty("message", "User deleted successfully");

            await truncate.user();
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
      });
});

// BIO
describe('Test endpoint create bio', () => {
    const invalidBio = {
        name: "Johndoe"
    }

    it('Should return 400 if not all fields is filled', async () => {
        try {
            const res = await request(app)
                        .post("/api/v1/bio")
                        .send(invalidBio)
                        .set("auth", "secret");
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty("status", "Error");
            expect(res.body).toHaveProperty("message", "Please fill all the fields")
            expect(res.body).toHaveProperty("data", null)
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });

    it('Should return error if not log in', async () => {
        try {
            const res = await request(app)
                        .post("/api/v1/bio")
                        .send(bio)
                        .set('auth', 'secret')
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty("status", "error");
            expect(res.body).toHaveProperty("message", "User not found");
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });

    it('Should return 400 if bio already exists', async () => {
        try {
            await request(app)
                    .post("/api/v1/users")
                    .send(user)

            await request(app)
                    .post("/api/v1/bio")
                    .send(bio)
                    .set('auth', 'secret');
            
            const res = await request(app)
                    .post("/api/v1/bio")
                    .send(bio)
                    .set('auth', 'secret');
    
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty("status", "error");
            expect(res.body).toHaveProperty("message", "Bio already exists");
            await truncate.bio()
            await truncate.user()
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });

    it('Should return 201 if bio succesfully created', async () => {
        try {
            await request(app)
                    .post("/api/v1/users")
                    .send(user)            
                    
            const res = await request(app)
                        .post("/api/v1/bio")
                        .send(bio)
                        .set('auth', 'secret');

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty("status", "Success");
            expect(res.body).toHaveProperty("message", "Bio created successfully");
            expect(res.body).toHaveProperty("data");
            expect(res.body.data.name).toBe(bio.name);
            expect(res.body.data.age).toBe(bio.age);
            expect(res.body.data.user_id).toBe(bio.user_id);

            await truncate.bio()
            await truncate.user()
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });
});

describe('Test endpoint get all Bio', () => {
    it('Should return 200 if bios retrieved successfully', async () => {
        try {
            await request(app)
                    .post("/api/v1/users")
                    .send(user)            
                    
            await request(app)
                    .post("/api/v1/bio")
                    .send(bio)
                    .set('auth', 'secret');

            const res = await request(app)
                        .get("/api/v1/bio")
                        .set('auth', 'secret');
    
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("status", "Success");
            expect(res.body).toHaveProperty("message", "Bios retrieved successfully");
            // expect array
            expect(res.body.data).toBeInstanceOf(Array);

            await truncate.bio()
            await truncate.user()
            
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });
});

describe('Test endpoint get particular bio', () => {
    it('Should return 404 if no Bio with selected Id', async () => {
        try {
            const res = await request(app)    
                        .get("/api/v1/bio/1")
                        .set('auth', 'secret');

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty("status", "Error");
            expect(res.body).toHaveProperty("message", "Bio not found");
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });

    it('Should return 200 if selected Bio is succesfully retrieved', async () => {
        try {
            await request(app)
                    .post("/api/v1/users")
                    .send(user)            
                    
            await request(app)
                    .post("/api/v1/bio")
                    .send(bio)
                    .set('auth', 'secret');

            const res = await request(app)    
                        .get("/api/v1/bio/1")
                        .set('auth', 'secret');

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("status", "Success");
            expect(res.body).toHaveProperty("message", "Bio retrieved successfully");
            expect(res.body).toHaveProperty("data");
            expect(res.body.data.name).toBe(bio.name);
            expect(res.body.data.age).toBe(bio.age);
            expect(res.body.data.user_id).toBe(bio.user_id);

            await truncate.bio()
            await truncate.user()
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });
});

describe('Test endpoint update particular bio', () => {
    const updatedBio = {
        name: "John Doe Update"
    }

    it('Should return 404 if no Bio with selected Id', async () => {
        try {
            const res = await request(app)    
                        .put("/api/v1/bio/1")
                        .set('auth', 'secret');

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty("status", "Error");
            expect(res.body).toHaveProperty("message", "Bio not found");
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });

    it('Should return 200 if selected Bio is succesfully updated', async () => {
        try {
            await request(app)
                    .post("/api/v1/users")
                    .send(user)            
                    
            await request(app)
                    .post("/api/v1/bio")
                    .send(bio)
                    .set('auth', 'secret');

            const res = await request(app)    
                        .put("/api/v1/bio/1")
                        .send(updatedBio)
                        .set('auth', 'secret');

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("status", "Success");
            expect(res.body).toHaveProperty("message", "Bio updated successfully");
            expect(res.body).toHaveProperty("data");
            expect(res.body.data.name).toBe(updatedBio.name);
            expect(res.body.data.age).toBe(bio.age);
            expect(res.body.data.user_id).toBe(bio.user_id);

            await truncate.bio()
            await truncate.user()
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });
});

describe('Test endpoint delete particular bio', () => {
    it('Should return 404 if no Bio with selected Id', async () => {
        try {
            const res = await request(app)    
                        .delete("/api/v1/bio/1")
                        .set('auth', 'secret');

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty("status", "Error");
            expect(res.body).toHaveProperty("message", "Bio not found");
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });

    it('Should return 200 if selected Bio is succesfully deleted', async () => {
        try {
            await request(app)
                    .post("/api/v1/users")
                    .send(user)            
                    
            await request(app)
                    .post("/api/v1/bio")
                    .send(bio)
                    .set('auth', 'secret');

            const res = await request(app)    
                        .delete("/api/v1/bio/1")
                        .set('auth', 'secret');

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("status", "Success");
            expect(res.body).toHaveProperty("message", "Bio deleted successfully");
            expect(res.body).toHaveProperty("data");

            await truncate.bio()
            await truncate.user()
        } catch (err) {
            console.log(err.message);
            expect(err).toBe(500);
        }
    });
});